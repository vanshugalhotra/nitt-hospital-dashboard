import { ApiProperty } from '@nestjs/swagger';
import { StaffRole } from '@prisma/client';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

export class StaffResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: StaffRole })
  role: StaffRole;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export type PaginatedStaffResponse = InstanceType<
  ReturnType<typeof PaginatedResponseDto<StaffResponseDto>>
>;
