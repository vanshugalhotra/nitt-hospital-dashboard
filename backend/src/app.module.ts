import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { StaffModule } from './modules/staff/staff.module';
import { AdminSeedService } from './prisma/seed/admin.seed';

@Module({
  imports: [ConfigModule, PrismaModule, LoggerModule, StaffModule],
  controllers: [AppController],
  providers: [AppService, AdminSeedService],
})
export class AppModule {}
