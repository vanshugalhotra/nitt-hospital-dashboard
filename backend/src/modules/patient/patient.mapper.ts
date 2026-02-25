import { Patient } from '@prisma/client';
import { PatientResponseDto } from './dto/patient-response.dto';

export function mapPatientToResponse(patient: Patient): PatientResponseDto {
  return {
    id: patient.id,
    name: patient.name,
    email: patient.email,
    identifier: patient.identifier,
    type: patient.type,
    gender: patient.gender,
    department: patient.department ?? undefined,
    address: patient.address ?? undefined,
    profileImage: patient.profileImage ?? undefined,
    isActive: patient.isActive,
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt,
  };
}

export function mapPatientListToResponse(
  patients: Patient[],
): PatientResponseDto[] {
  return patients.map(mapPatientToResponse);
}
