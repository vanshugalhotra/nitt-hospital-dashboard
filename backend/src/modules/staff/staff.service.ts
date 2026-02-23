import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, StaffUser } from '@prisma/client';
import { StaffRepository } from './repository/staff.repository';
import { StaffValidationService } from './validation/staff-validation.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PaginatedStaffResponse } from './dto/staff-response.dto';
import { buildQueryArgs } from 'src/common/utils/query-builder.util';
import { hashPassword } from 'src/common/utils/auth/password.util';
import { QueryOptionsDto } from 'src/common/dto/query-options.dto';

@Injectable()
export class StaffService {
  constructor(
    private readonly staffRepo: StaffRepository,
    private readonly validation: StaffValidationService,
  ) {}

  /* --------------------------------------------------------------------------
   | CREATE STAFF
   -------------------------------------------------------------------------- */
  async create(dto: CreateStaffDto): Promise<StaffUser> {
    await this.validation.validateCreate(dto.email);

    // Hash password
    const hashedPassword = await hashPassword(dto.password);

    // Prepare Prisma create input
    const data: Prisma.StaffUserCreateInput = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      isActive: dto.isActive ?? true,
    };

    return this.staffRepo.create(data);
  }

  /* --------------------------------------------------------------------------
   | FIND ONE STAFF
   -------------------------------------------------------------------------- */
  async findOne(id: string): Promise<StaffUser> {
    const staff = await this.staffRepo.findById(id);
    if (!staff) {
      throw new NotFoundException(`Staff with id "${id}" not found`);
    }
    return staff;
  }

  /* --------------------------------------------------------------------------
   | FIND ALL
   -------------------------------------------------------------------------- */
  async findAll(query: QueryOptionsDto): Promise<PaginatedStaffResponse> {
    const queryArgs = buildQueryArgs<StaffUser, Prisma.StaffUserWhereInput>(
      query,
      ['name', 'email'],
    );

    const [items, total] = await Promise.all([
      this.staffRepo.findMany({
        where: queryArgs.where,
        skip: queryArgs.skip,
        take: queryArgs.take,
        orderBy: queryArgs.orderBy,
      }),
      this.staffRepo.count(queryArgs.where),
    ]);

    return { items, total };
  }

  /* --------------------------------------------------------------------------
   | UPDATE STAFF
   -------------------------------------------------------------------------- */
  async update(
    id: string,
    dto: UpdateStaffDto,
    actingUserId: string,
  ): Promise<StaffUser> {
    // Validate update rules
    await this.validation.validateUpdate(
      id,
      actingUserId,
      dto.email,
      dto.isActive,
    );

    const updateData: Prisma.StaffUserUpdateInput = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    if (dto.password) {
      updateData.password = await hashPassword(dto.password);
    }

    return this.staffRepo.update(id, updateData);
  }

  /* --------------------------------------------------------------------------
   | REMOVE STAFF (SOFT DELETE)
   -------------------------------------------------------------------------- */
  async remove(id: string, actingUserId: string): Promise<StaffUser> {
    // Reuse validation: prevent self-deactivate, last active admin, etc.
    await this.validation.validateUpdate(
      id,
      actingUserId,
      undefined,
      false, // force isActive = false
    );

    return this.staffRepo.update(id, { isActive: false });
  }
}
