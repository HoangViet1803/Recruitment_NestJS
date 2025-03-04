import {
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
  IsDate,
  IsMongoId,
  ValidateNested,
  IsNotEmptyObject,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class CompanyDto {
  @IsMongoId()
  _id: string;

  @IsString()
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true }) // Mỗi phần tử trong mảng phải là string
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested() // Kiểm tra nested object
  @Type(() => CompanyDto) // Chuyển đổi dữ liệu đầu vào thành CompanyDto
  company: CompanyDto;

  @IsNotEmpty()
  @IsString()
  jobLocation: string;

  @IsNumber()
  @IsNotEmpty()
  salary: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  description: string; // HTML content stored as string

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date) // Chuyển đổi dữ liệu đầu vào thành Date
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
