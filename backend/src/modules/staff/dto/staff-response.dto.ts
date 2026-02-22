import { ApiProperty } from '@nestjs/swagger';
import { StaffRole } from '@prisma/client';

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
}
