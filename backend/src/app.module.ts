import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { StaffModule } from './modules/staff/staff.module';
import { AdminSeedService } from './prisma/seed/admin.seed';
import { AuthModule } from './modules/auth/auth.module';
import { PatientModule } from './modules/patient/patient.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    LoggerModule,
    StaffModule,
    AuthModule,
    PatientModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminSeedService],
})
export class AppModule {}
