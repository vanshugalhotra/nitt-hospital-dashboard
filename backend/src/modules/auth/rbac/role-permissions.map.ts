import { StaffRole } from '@prisma/client';

export const PERMISSIONS = {
  STAFF_CREATE: 'staff.create',
  STAFF_READ: 'staff.read',
  STAFF_UPDATE: 'staff.update',
  STAFF_DELETE: 'staff.delete',
  PATIENT_CREATE: 'patient.create',
  PATIENT_READ: 'patient.read',
  PATIENT_UPDATE: 'patient.update',
  PATIENT_DELETE: 'patient.delete',

  // extras
  OTP_MANAGE: 'otp.manage',
} as const;

export type AppPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type AppRole = StaffRole;

export const ROLE_PERMISSIONS: Record<
  AppRole,
  readonly AppPermission[] | readonly ['*']
> = {
  [StaffRole.ADMIN]: ['*'],
  [StaffRole.DOCTOR]: [PERMISSIONS.PATIENT_READ],
  [StaffRole.PHARMACY]: [PERMISSIONS.PATIENT_READ],
  [StaffRole.LAB]: [PERMISSIONS.PATIENT_READ],
  [StaffRole.HOSPITAL_ADMIN]: [PERMISSIONS.PATIENT_READ],
};
