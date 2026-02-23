import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, StaffUser } from '@prisma/client';
import { StaffRepository } from './repository/staff.repository';
import { StaffValidationService } from './validation/staff-validation.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import {
  PaginatedStaffResponse,
  StaffResponseDto,
} from './dto/staff-response.dto';
import { buildQueryArgs } from 'src/common/utils/query-builder.util';
import { hashPassword } from 'src/common/utils/auth/password.util';
import { QueryOptionsDto } from 'src/common/dto/query-options.dto';
import { handlePrismaError } from 'src/common/utils/prisma-error-handler';
import { LoggerService } from 'src/logger/logger.service';
import { mapStaffToResponse, mapStaffListToResponse } from './staff.mapper';

@Injectable()
export class StaffService {
  private readonly entity = 'StaffUser';

  constructor(
    private readonly staffRepo: StaffRepository,
    private readonly validation: StaffValidationService,
    private readonly logger: LoggerService,
  ) {}

  /* -------------------------------------------------------------------------- */
  /* CREATE STAFF */
  /* -------------------------------------------------------------------------- */
  async create(dto: CreateStaffDto): Promise<StaffResponseDto> {
    try {
      this.logger.info('Creating staff user', {
        email: dto.email,
        role: dto.role,
      });

      await this.validation.validateCreate(dto.email);

      const hashedPassword = await hashPassword(dto.password);

      const data: Prisma.StaffUserCreateInput = {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        isActive: dto.isActive ?? true,
      };

      const staff = await this.staffRepo.create(data);

      this.logger.info('Staff user created successfully', {
        id: staff.id,
        email: staff.email,
      });

      return mapStaffToResponse(staff);
    } catch (error: unknown) {
      this.logger.error('Failed to create staff user', {
        email: dto.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, this.entity);
      }
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* FIND ONE */
  /* -------------------------------------------------------------------------- */
  async findOne(id: string): Promise<StaffResponseDto> {
    try {
      this.logger.debug('Fetching staff user', { id });

      const staff = await this.staffRepo.findById(id);

      if (!staff) {
        this.logger.warn('Staff user not found', { id });
        throw new NotFoundException(`Staff with id "${id}" not found`);
      }

      return mapStaffToResponse(staff);
    } catch (error: unknown) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error('Error fetching staff user', {
          id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, this.entity);
      }
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* FIND ALL */
  /* -------------------------------------------------------------------------- */
  async findAll(query: QueryOptionsDto): Promise<PaginatedStaffResponse> {
    try {
      this.logger.debug('Fetching staff users', JSON.stringify(query));
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

      this.logger.info('Staff users fetched successfully', {
        count: items.length,
        total,
      });

      return {
        items: mapStaffListToResponse(items),
        total,
      };
    } catch (error: unknown) {
      this.logger.error('Failed to fetch staff users', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientValidationError
      ) {
        handlePrismaError(error, this.entity);
      }
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* UPDATE STAFF */
  /* -------------------------------------------------------------------------- */
  async update(
    id: string,
    dto: UpdateStaffDto,
    actingUserId: string,
  ): Promise<StaffResponseDto> {
    try {
      this.logger.info('Updating staff user', { id, actingUserId });

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

      const updated = await this.staffRepo.update(id, updateData);

      this.logger.info('Staff user updated successfully', { id: updated.id });

      return mapStaffToResponse(updated);
    } catch (error: unknown) {
      this.logger.error('Failed to update staff user', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, this.entity);
      }
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* REMOVE STAFF (SOFT DELETE) */
  /* -------------------------------------------------------------------------- */
  async remove(id: string, actingUserId: string): Promise<StaffResponseDto> {
    try {
      this.logger.info('Soft deleting staff user', { id, actingUserId });

      await this.validation.validateUpdate(id, actingUserId, undefined, false);

      const updated = await this.staffRepo.update(id, {
        isActive: false,
      });

      this.logger.info('Staff user soft deleted successfully', {
        id: updated.id,
      });

      return mapStaffToResponse(updated);
    } catch (error: unknown) {
      this.logger.error('Failed to soft delete staff user', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, this.entity);
      }
      throw error;
    }
  }
}
