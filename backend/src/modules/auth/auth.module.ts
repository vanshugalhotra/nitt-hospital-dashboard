import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/access-token.strategy';
import { JwtAuthGuard } from './gaurds/jwt-auth.gaurd';
import { StaffRepository } from '../staff/repository/staff.repository';
import { AuthStaffController } from './auth-staff.controller';
import { AuthStaffService } from './auth-staff.service';
import { AuthPatientService } from './auth-patient.service';
import { JwtService } from '@nestjs/jwt';
import { PatientRepository } from '../patient/repository/patient.repository';
import { OtpService } from 'src/otp/otp.service';
import { EmailService } from 'src/email/email.service';
import { OtpNotificationService } from 'src/otp/otp-notification.service';
import { PatientService } from '../patient/patient.service';
import { PatientValidationService } from '../patient/validation/patient-validation.service';
import { AuthPatientController } from './auth-patient.controller';

@Module({
  imports: [PassportModule],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    StaffRepository,
    JwtService,
    AuthStaffService,
    AuthPatientService,
    PatientRepository,
    OtpService,
    EmailService,
    OtpNotificationService,
    PatientService,
    PatientValidationService,
  ],
  exports: [JwtAuthGuard, AuthStaffService, AuthPatientService],
  controllers: [AuthStaffController, AuthPatientController],
})
export class AuthModule {}
