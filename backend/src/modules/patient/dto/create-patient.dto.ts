import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { PatientType, Gender } from '@prisma/client';

export class CreatePatientDto {
  @ApiProperty({ example: 'Vanshu Galhotra' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '205124107@nitt.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '205124107' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ enum: PatientType })
  @IsEnum(PatientType)
  type: PatientType;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'CA', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 'JADE, 48', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'https://cdn.app/patient1.png', required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
