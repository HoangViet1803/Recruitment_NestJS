import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  };

  async isEmailExisted(email: string) {
    const user = await this.findOneByUsername(email);
    return user !== null;
  }
  async create(createUserDto: CreateUserDto) {
    const { email, password, ...restUserData } = createUserDto;
    const isEmailExisted = await this.isEmailExisted(email);
    if (!isEmailExisted) {
      const hashedPassword = this.getHashPassword(password);
      const newUser = await this.userModel.create({
        email,
        password: hashedPassword,
        ...restUserData,
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
      console.log(hashedPassword);
      return this.userModel.create({
        email,
        password: hashedPassword,
        ...restUserData,
        role: 'USER',
        company: null,
      });
    } else {
      throw new BadRequestException('Email already existed');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id) || !id)
      return 'Không tìm thấy người dùng';
    return this.userModel.findOne({ _id: id });
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

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id) || !id) return 'not found user';
    return this.userModel.softDelete({ _id: id });
  }
}
