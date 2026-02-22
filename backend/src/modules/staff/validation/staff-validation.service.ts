import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { StaffRepository } from '../repository/staff.repository';
import { StaffRole, StaffUser } from '@prisma/client';

@Injectable()
export class StaffValidationService {
  constructor(private readonly staffRepo: StaffRepository) {}

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
    const existing = await this.staffRepo.findByEmailInsensitive(
      email,
      excludeId,
    );

    if (existing) {
      throw new ConflictException(`Staff with email "${email}" already exists`);
    }
  }

  /**
   * Ensure at least one active admin remains
   */
  private async validateLastActiveAdminProtection(
    staff: StaffUser,
    updatingIsActive?: boolean,
  ): Promise<void> {
    if (staff.role !== StaffRole.ADMIN) return;

    const willBeInactive =
      typeof updatingIsActive === 'boolean'
        ? updatingIsActive === false
        : false;

    if (!willBeInactive) return;

    const activeAdminsCount = await this.staffRepo.count({
      role: StaffRole.ADMIN,
      isActive: true,
    });

    if (activeAdminsCount <= 1) {
      throw new ConflictException('System must have at least one active admin');
    }
  }

  /**
   * Prevent admin from deactivating themselves
   */
  private validateSelfDeactivation(
    staffId: string,
    actingUserId: string,
    updatingIsActive?: boolean,
  ): void {
    if (staffId !== actingUserId) return;
    if (updatingIsActive !== false) return;

    throw new ConflictException('You cannot deactivate your own account');
  }

  /*
   |--------------------------------------------------------------------------
   | Public Validation Methods
   |--------------------------------------------------------------------------
   */

  /**
   * Validate staff creation
   */
  async validateCreate(email: string): Promise<void> {
    await this.validateEmailUnique(email);
  }

  /**
   * Validate staff update
   */
  async validateUpdate(
    id: string,
    actingUserId: string,
    email?: string,
    isActive?: boolean,
  ): Promise<{ staff: StaffUser }> {
    // Check existence
    const staff = await this.staffRepo.findById(id);
    if (!staff) {
      throw new NotFoundException(`Staff with id "${id}" not found`);
    }

    // Email uniqueness (if changing)
    if (email && email.toLowerCase() !== staff.email.toLowerCase()) {
      await this.validateEmailUnique(email, id);
    }

    // Self-deactivation protection
    this.validateSelfDeactivation(id, actingUserId, isActive);

    // Last active admin protection
    await this.validateLastActiveAdminProtection(staff, isActive);

    return { staff };
  }
}
