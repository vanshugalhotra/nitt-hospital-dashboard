import { ApiProperty } from '@nestjs/swagger';
import { StaffRole } from '@prisma/client';

export class StaffAuthResponseDto {
  @ApiProperty({
    example: 'a3f5c9e2-8c1b-4d23-b9aa-9c7f6e3f1111',
    description: 'Unique staff ID (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the staff member',
  })
  name: string;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email address of the staff member',
  })
  email: string;

  @ApiProperty({
    enum: StaffRole,
    example: StaffRole.ADMIN,
    description: 'Role assigned to the staff member',
  })
  role: StaffRole;
}

export class PatientAuthResponseDto {
  @ApiProperty({
    example: 'a3f5c9e2-8c1b-4d23-b9aa-9c7f6e3f1111',
    description: 'Unique patient ID (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the patient',
  })
  name: string;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email address of the patient',
  })
  email: string;
}
