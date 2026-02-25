import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, Patient } from '@prisma/client';
import { PatientRepository } from './repository/patient.repository';
import { PatientValidationService } from './validation/patient-validation.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import {
  PaginatedPatientResponse,
  PatientResponseDto,
} from './dto/patient-response.dto';
import { buildQueryArgs } from 'src/common/utils/query-builder.util';
import { hashPassword } from 'src/common/utils/auth/password.util';
import { QueryOptionsDto } from 'src/common/dto/query-options.dto';
import { handlePrismaError } from 'src/common/utils/prisma-error-handler';
import { LoggerService } from 'src/logger/logger.service';
import {
  mapPatientToResponse,
  mapPatientListToResponse,
} from './patient.mapper';

@Injectable()
export class PatientService {
  private readonly entity = 'Patient';

  constructor(
    private readonly patientRepo: PatientRepository,
    private readonly validation: PatientValidationService,
    private readonly logger: LoggerService,
  ) {}

  /* -------------------------------------------------------------------------- */
  /* CREATE PATIENT */
  /* -------------------------------------------------------------------------- */
  async create(dto: CreatePatientDto): Promise<PatientResponseDto> {
    try {
      this.logger.info('Creating patient', {
        email: dto.email,
        identifier: dto.identifier,
      });

      await this.validation.validateCreate(dto.email, dto.identifier);

      const hashedPassword = await hashPassword(dto.password);

      const data: Prisma.PatientCreateInput = {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        identifier: dto.identifier,
        type: dto.type,
        gender: dto.gender,
        department: dto.department,
        address: dto.address,
        profileImage: dto.profileImage,
        isActive: dto.isActive ?? true,
      };

      const patient = await this.patientRepo.create(data);

      this.logger.info('Patient created successfully', {
        id: patient.id,
        email: patient.email,
      });

      return mapPatientToResponse(patient);
    } catch (error: unknown) {
      this.logger.error('Failed to create patient', {
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
  async findOne(id: string): Promise<PatientResponseDto> {
    try {
      this.logger.debug('Fetching patient', { id });

      const patient = await this.patientRepo.findById(id);

      if (!patient || !patient.isActive) {
        this.logger.warn('Patient not found', { id });
        throw new NotFoundException(`Patient with id "${id}" not found`);
      }

      return mapPatientToResponse(patient);
    } catch (error: unknown) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error('Error fetching patient', {
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
  async findAll(query: QueryOptionsDto): Promise<PaginatedPatientResponse> {
    try {
      this.logger.debug('Fetching patients', JSON.stringify(query));

      const queryArgs = buildQueryArgs<Patient, Prisma.PatientWhereInput>(
        query,
        ['name', 'email', 'identifier'],
      );

      const where: Prisma.PatientWhereInput = {
        ...queryArgs.where,
      };

      if (where.isActive === undefined) {
        where.isActive = true;
      }

      const [items, total] = await Promise.all([
        this.patientRepo.findMany({
          where,
          skip: queryArgs.skip,
          take: queryArgs.take,
          orderBy: queryArgs.orderBy,
        }),
        this.patientRepo.count(where),
      ]);

      this.logger.info('Patients fetched successfully', {
        count: items.length,
        total,
      });

      return {
        items: mapPatientListToResponse(items),
        total,
      };
    } catch (error: unknown) {
      this.logger.error('Failed to fetch patients', {
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
  /* UPDATE PATIENT */
  /* -------------------------------------------------------------------------- */
  async update(id: string, dto: UpdatePatientDto): Promise<PatientResponseDto> {
    try {
      this.logger.info('Updating patient', { id });

      const { patient } = await this.validation.validateUpdate(
        id,
        dto.email,
        dto.identifier,
      );

      if (!patient.isActive) {
        throw new NotFoundException(`Patient with id "${id}" not found`);
      }

      const updateData: Prisma.PatientUpdateInput = {};

      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.email !== undefined) updateData.email = dto.email;
      if (dto.identifier !== undefined) updateData.identifier = dto.identifier;
      if (dto.type !== undefined) updateData.type = dto.type;
      if (dto.gender !== undefined) updateData.gender = dto.gender;
      if (dto.department !== undefined) updateData.department = dto.department;
      if (dto.address !== undefined) updateData.address = dto.address;
      if (dto.profileImage !== undefined)
        updateData.profileImage = dto.profileImage;
      if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

      const updated = await this.patientRepo.update(id, updateData);

      this.logger.info('Patient updated successfully', {
        id: updated.id,
      });

      return mapPatientToResponse(updated);
    } catch (error: unknown) {
      this.logger.error('Failed to update patient', {
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
  /* REMOVE PATIENT (SOFT DELETE) */
  /* -------------------------------------------------------------------------- */
  async remove(id: string): Promise<PatientResponseDto> {
    try {
      this.logger.info('Soft deleting patient', { id });

      const patient = await this.validation.validateExists(id);

      if (!patient.isActive) {
        throw new ConflictException(
          `Patient with id "${id}" is already inactive`,
        );
      }

      const updated = await this.patientRepo.update(id, {
        isActive: false,
      });

      this.logger.info('Patient soft deleted successfully', {
        id: updated.id,
      });

      return mapPatientToResponse(updated);
    } catch (error: unknown) {
      this.logger.error('Failed to soft delete patient', {
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
