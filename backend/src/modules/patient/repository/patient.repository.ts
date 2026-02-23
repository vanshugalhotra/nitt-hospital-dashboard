import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Patient } from '@prisma/client';

@Injectable()
export class PatientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: { id },
    });
  }
}
