import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { StaffRole } from '@prisma/client';

export class CreateStaffDto {
  @ApiProperty({ example: 'Dr. Ustaad JI' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'doctor@nitt.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: StaffRole })
  @IsEnum(StaffRole)
  role: StaffRole;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
