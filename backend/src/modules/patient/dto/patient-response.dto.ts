import { ApiProperty } from '@nestjs/swagger';
import { PatientType, Gender } from '@prisma/client';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

export class PatientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  identifier: string;

  @ApiProperty({ enum: PatientType })
  type: PatientType;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty({ required: false })
  department?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  profileImage?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export type PaginatedPatientResponse = InstanceType<
  ReturnType<typeof PaginatedResponseDto<PatientResponseDto>>
>;
