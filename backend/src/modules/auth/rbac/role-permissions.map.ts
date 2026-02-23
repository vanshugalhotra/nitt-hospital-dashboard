import { StaffRole } from '@prisma/client';

export const PERMISSIONS = {
  STAFF_CREATE: 'staff.write',
  STAFF_READ: 'staff.read',
  STAFF_UPDATE: 'staff.update',
  STAFF_DELETE: 'staff.delete',
} as const;

export type AppPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type AppRole = StaffRole;

export const ROLE_PERMISSIONS: Record<
  AppRole,
  readonly AppPermission[] | readonly ['*']
> = {
  [StaffRole.ADMIN]: ['*'],
  [StaffRole.DOCTOR]: [],
  [StaffRole.PHARMACY]: [],
  [StaffRole.LAB]: [],
  [StaffRole.HOSPITAL_ADMIN]: [],
};
