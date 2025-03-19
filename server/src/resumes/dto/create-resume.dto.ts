import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsMongoId()
  @IsNotEmpty({ message: 'userId không được để trống' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsString()
  @IsOptional()
  url: string;

  @IsEnum(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'])
  @IsOptional()
  @IsNotEmpty({ message: 'status không được để trống' })
  status: string;

  @IsMongoId()
  @IsOptional()
  @IsNotEmpty({ message: 'companyId không được để trống' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  @IsNotEmpty({ message: 'jobId không được để trống' })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'status không được để trống' })
  @IsMongoId({ message: 'companyId is a mongo id' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'jobId is a mongo id' })
  @IsMongoId({ message: 'jobId is a mongo id' })
  jobId: mongoose.Schema.Types.ObjectId;
}
