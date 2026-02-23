import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from 'src/config/config.service';
import { LoggerService } from 'src/logger/logger.service';
import { StaffRole } from '@prisma/client';
import { hashPassword } from 'src/common/utils/auth/password.util';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = this.config.get('SUPER_ADMIN_EMAIL');
    const adminPassword = this.config.get('SUPER_ADMIN_PASSWORD');
    const adminName = this.config.get('SUPER_ADMIN_NAME') || 'Admin';

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        'SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not provided. Skipping admin seed.',
      );
      return;
    }

    const existingAdmin = await this.prisma.staffUser.findFirst({
      where: { role: StaffRole.ADMIN },
    });

    if (existingAdmin) {
      this.logger.info(
        `Admin already exists (${existingAdmin.email}). Skipping seed.`,
      );
      return;
    }

    const hashedPassword = await hashPassword(adminPassword);

    await this.prisma.staffUser.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: StaffRole.ADMIN,
        isActive: true,
      },
    });

    this.logger.info(`Initial admin created successfully (${adminEmail}).`);
  }
}
