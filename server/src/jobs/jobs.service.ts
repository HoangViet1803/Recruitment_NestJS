import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
  ) {}
  async create(createJobDto: CreateJobDto, user: IUser) {
    const newJob = await this.jobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newJob._id,
      createdAt: newJob.createdAt as Date,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .select('-password')
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      throw new BadRequestException('ID không hợp lệ hoặc không được cung cấp');
    }
    return this.jobModel.findById({ _id: id });
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const job = await this.jobModel.findOne({ _id: id });
    if (!job) {
      throw new NotFoundException(`Job not exists or is already deleted.`);
    }
    return await this.jobModel.updateOne(
      { _id: id },
      { ...updateJobDto, updatedBy: { _id: user._id, email: user.email } },
    );
  }

  async remove(id: string, user: IUser) {
    await this.jobModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.jobModel.softDelete({ _id: id });
  }
}
