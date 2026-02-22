import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, StaffUser } from '@prisma/client';

@Injectable()
export class StaffRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.StaffUserCreateInput): Promise<StaffUser> {
    return this.prisma.staffUser.create({ data });
  }

  async findById(id: string): Promise<StaffUser | null> {
    return this.prisma.staffUser.findUnique({
      where: { id },
    });
  }

  async findByEmail(
    email: string,
    isActive?: boolean,
  ): Promise<StaffUser | null> {
    return this.prisma.staffUser.findFirst({
      where: {
        email,
        ...(typeof isActive === 'boolean' && { isActive }),
      },
    });
  }

  async findByEmailInsensitive(
    email: string,
    excludeId?: string,
  ): Promise<StaffUser | null> {
    return this.prisma.staffUser.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  }

  async findMany(args: {
    where?: Prisma.StaffUserWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.StaffUserOrderByWithRelationInput;
    include?: Prisma.StaffUserInclude;
  }): Promise<StaffUser[]> {
    return this.prisma.staffUser.findMany(args);
  }

  async count(where?: Prisma.StaffUserWhereInput): Promise<number> {
    return this.prisma.staffUser.count({ where });
  }

  async update(
    id: string,
    data: Prisma.StaffUserUpdateInput,
  ): Promise<StaffUser> {
    return this.prisma.staffUser.update({
      where: { id },
      data,
    });
  }
}
