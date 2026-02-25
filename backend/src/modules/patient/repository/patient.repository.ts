import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Patient } from '@prisma/client';

@Injectable()
export class PatientRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ────────────────────────────────────────────────
  // CREATE
  // ────────────────────────────────────────────────
  async create(data: Prisma.PatientCreateInput): Promise<Patient> {
    return this.prisma.patient.create({ data });
  }

  // ────────────────────────────────────────────────
  // FIND BY ID
  // ────────────────────────────────────────────────
  async findById(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: { id },
    });
  }

  // ────────────────────────────────────────────────
  // FIND BY EMAIL (exact)
  // ────────────────────────────────────────────────
  async findByEmail(
    email: string,
    isActive?: boolean,
  ): Promise<Patient | null> {
    return this.prisma.patient.findFirst({
      where: {
        email,
        ...(typeof isActive === 'boolean' && { isActive }),
      },
    });
  }

  // ────────────────────────────────────────────────
  // FIND BY EMAIL (case-insensitive)
  // ────────────────────────────────────────────────
  async findByEmailInsensitive(
    email: string,
    excludeId?: string,
  ): Promise<Patient | null> {
    return this.prisma.patient.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  }

  // ────────────────────────────────────────────────
  // FIND BY IDENTIFIER
  // ────────────────────────────────────────────────
  async findByIdentifier(
    identifier: string,
    excludeId?: string,
  ): Promise<Patient | null> {
    return this.prisma.patient.findFirst({
      where: {
        identifier,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  }

  // ────────────────────────────────────────────────
  // PAGINATED FIND
  // ────────────────────────────────────────────────
  async findMany(args: {
    where?: Prisma.PatientWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.PatientOrderByWithRelationInput;
    include?: Prisma.PatientInclude;
  }): Promise<Patient[]> {
    return this.prisma.patient.findMany(args);
  }

  // ────────────────────────────────────────────────
  // COUNT
  // ────────────────────────────────────────────────
  async count(where?: Prisma.PatientWhereInput): Promise<number> {
    return this.prisma.patient.count({ where });
  }

  // ────────────────────────────────────────────────
  // UPDATE
  // ────────────────────────────────────────────────
  async update(id: string, data: Prisma.PatientUpdateInput): Promise<Patient> {
    return this.prisma.patient.update({
      where: { id },
      data,
    });
  }

  // ────────────────────────────────────────────────
  // SOFT DELETE
  // ────────────────────────────────────────────────
  async deactivate(id: string): Promise<Patient> {
    return this.prisma.patient.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
