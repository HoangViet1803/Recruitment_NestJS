import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  };

  async isEmailExisted(email: string) {
    const user = await this.findOneByUsername(email);
    return user !== null;
  }
  async create(createUserDto: CreateUserDto, user: IUser) {
    const { email, password, ...restUserData } = createUserDto;
    const isEmailExisted = await this.isEmailExisted(email);
    if (!isEmailExisted) {
      const hashedPassword = this.getHashPassword(password);
      const newUser = await this.userModel.create({
        email,
        password: hashedPassword,
        ...restUserData,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
      return {
        _id: newUser._id,
        createdAt: newUser.createdAt,
      };
    } else {
      throw new BadRequestException('Email already existed');
    }
  }

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, ...restUserData } = registerUserDto;
    const isEmailExisted = await this.isEmailExisted(email);
    if (!isEmailExisted) {
      const hashedPassword = this.getHashPassword(password);
      return this.userModel.create({
        email,
        password: hashedPassword,
        ...restUserData,
        role: 'USER',
        company: null,
      });
    } else {
      throw new BadRequestException(`Email ${email} already existed`);
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
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
    return this.userModel.findOne({ _id: id }).select('-password');
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username });
  }

  isValidPassword(password: string, hashedPassword: string) {
    return compareSync(password, hashedPassword);
  }

  async update(updateUserDto: UpdateUserDto) {
    const updateData = { ...updateUserDto };

    // Kiểm tra nếu password có trong object (do request gửi lên) thì loại bỏ
    if ('password' in updateData) {
      delete updateData.password;
    }

    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      updateData,
    );
  }

  async remove(id: string, currentUser: IUser) {
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: currentUser._id,
          email: currentUser.email,
        },
      },
    );
    return this.userModel.softDelete({ _id: id });
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return this.userModel.updateOne(
      { _id },
      {
        refresh_token: refreshToken,
      },
    );
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refresh_token: refreshToken });
  };
}
