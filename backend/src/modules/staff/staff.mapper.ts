import { StaffUser } from '@prisma/client';
import { StaffResponseDto } from './dto/staff-response.dto';

export function mapStaffToResponse(staff: StaffUser): StaffResponseDto {
  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    isActive: staff.isActive,
    createdAt: staff.createdAt,
    updatedAt: staff.updatedAt,
  };
}

export function mapStaffListToResponse(
  staffList: StaffUser[],
): StaffResponseDto[] {
  return staffList.map(mapStaffToResponse);
}
