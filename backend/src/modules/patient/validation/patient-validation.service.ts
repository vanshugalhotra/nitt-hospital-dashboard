import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PatientRepository } from '../repository/patient.repository';
import { Patient } from '@prisma/client';

@Injectable()
export class PatientValidationService {
  constructor(private readonly patientRepo: PatientRepository) {}

  /*
   |--------------------------------------------------------------------------
   | Private Helpers
   |--------------------------------------------------------------------------
   */

  /**
   * Ensure email is unique (case-insensitive)
   */
  private async validateEmailUnique(
    email: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.patientRepo.findByEmailInsensitive(
      email,
      excludeId,
    );

    if (existing) {
      throw new ConflictException(
        `Patient with email "${email}" already exists`,
      );
    }
  }

  /**
   * Ensure identifier is unique
   */
  private async validateIdentifierUnique(
    identifier: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.patientRepo.findByIdentifier(
      identifier,
      excludeId,
    );

    if (existing) {
      throw new ConflictException(
        `Patient with identifier "${identifier}" already exists`,
      );
    }
  }

  /*
   |--------------------------------------------------------------------------
   | Public Validation Methods
   |--------------------------------------------------------------------------
   */

  /**
   * Validate patient creation
   */
  async validateCreate(email: string, identifier: string): Promise<void> {
    await this.validateEmailUnique(email);
    await this.validateIdentifierUnique(identifier);
  }

  /**
   * Validate patient update
   */
  async validateUpdate(
    id: string,
    email?: string,
    identifier?: string,
  ): Promise<{ patient: Patient }> {
    // Check existence
    const patient = await this.patientRepo.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with id "${id}" not found`);
    }

    // Email uniqueness (if changed)
    if (email && email.toLowerCase() !== patient.email.toLowerCase()) {
      await this.validateEmailUnique(email, id);
    }

    // Identifier uniqueness (if changed)
    if (identifier && identifier !== patient.identifier) {
      await this.validateIdentifierUnique(identifier, id);
    }

    return { patient };
  }

  /**
   * Validate patient existence (used for delete / read)
   */
  async validateExists(id: string): Promise<Patient> {
    const patient = await this.patientRepo.findById(id);

    if (!patient) {
      throw new NotFoundException(`Patient with id "${id}" not found`);
    }

    return patient;
  }
}
