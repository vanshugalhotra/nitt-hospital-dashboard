import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PatientRepository } from '../patient/repository/patient.repository';
import { PatientService } from '../patient/patient.service';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';

import {
  RegisterPatientDto,
  PatientLoginDto,
  ResetPasswordDto,
  ForgotPasswordDto,
} from './dto/patient-auth.dto';

import { PatientAuthResponseDto } from './dto/auth-response.dto';

import {
  verifyPassword,
  hashPassword,
} from 'src/common/utils/auth/password.util';
import { generateAccessToken } from 'src/common/utils/auth/jwt.util';

import { OtpNotificationService } from 'src/otp/otp-notification.service';
import { ConfigService } from 'src/config/config.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AuthPatientService {
  private readonly entity = 'PatientAuth';

  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly patientService: PatientService,
    private readonly otpNotificationService: OtpNotificationService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  /* -------------------------------------------------------------------------- */
  /* REGISTER - STEP 1: REQUEST OTP */
  /* -------------------------------------------------------------------------- */

  async requestRegistrationOtp(dto: {
    email: string;
    identifier: string;
  }): Promise<{ message: string }> {
    try {
      const email = dto.email.toLowerCase();

      this.logger.info('Registration OTP request', { email });

      const existingEmail =
        await this.patientRepository.findByEmailInsensitive(email);

      if (existingEmail) {
        throw new UnauthorizedException('Email already registered');
      }

      const existingIdentifier = await this.patientRepository.findByIdentifier(
        dto.identifier,
      );

      if (existingIdentifier) {
        throw new UnauthorizedException('Identifier already registered');
      }

      await this.otpNotificationService.sendOtpEmail(
        email,
        'Patient Registration',
      );

      return { message: 'OTP sent successfully' };
    } catch (error: unknown) {
      this.logger.error('Registration OTP request failed', {
        email: dto.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* REGISTER - STEP 2: VERIFY OTP + CREATE PATIENT */
  /* -------------------------------------------------------------------------- */

  async verifyAndRegisterPatient(
    dto: RegisterPatientDto & { otp: string },
  ): Promise<{ message: string }> {
    try {
      const email = dto.email.toLowerCase();

      this.logger.info('Registration verification attempt', { email });

      await this.otpNotificationService.verifyOtp(email, dto.otp);

      const createDto: CreatePatientDto = {
        name: dto.name,
        email,
        identifier: dto.identifier,
        type: dto.type,
        gender: dto.gender,
        department: dto.department,
        address: dto.address,
        profileImage: dto.profileImage,
        password: dto.password,
        isActive: true,
      };

      const patient = await this.patientService.create(createDto);

      this.logger.info('Patient registered successfully', {
        patientId: patient.id,
        email: patient.email,
      });

      return {
        message: 'Registration successful. Please login to continue.',
      };
    } catch (error: unknown) {
      this.logger.error('Registration verification failed', {
        email: dto.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* PATIENT LOGIN */
  /* -------------------------------------------------------------------------- */

  async loginPatient(dto: PatientLoginDto): Promise<{
    accessToken: string;
    user: PatientAuthResponseDto;
  }> {
    try {
      const email = dto.email.toLowerCase();

      this.logger.info('Patient login attempt', { email });

      const patient = await this.patientRepository.findByEmail(email, true);

      if (!patient) {
        this.logger.warn('Patient login failed: email not found', { email });
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await verifyPassword(
        dto.password,
        patient.password,
      );

      if (!isPasswordValid) {
        this.logger.warn('Patient login failed: incorrect password', {
          email,
          patientId: patient.id,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      const accessToken = generateAccessToken(
        this.jwtService,
        this.configService,
        {
          id: patient.id,
          email: patient.email,
          type: 'patient',
        },
      );

      this.logger.info('Patient login successful', {
        patientId: patient.id,
      });

      return {
        accessToken,
        user: {
          id: patient.id,
          name: patient.name,
          email: patient.email,
        },
      };
    } catch (error: unknown) {
      if (!(error instanceof UnauthorizedException)) {
        this.logger.error('Unexpected login error', {
          email: dto.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* FORGOT PASSWORD - REQUEST OTP */
  /* -------------------------------------------------------------------------- */

  async forgotPasswordPatient(
    dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const email = dto.email.toLowerCase();

      this.logger.info('Forgot password request', { email });

      const patient =
        await this.patientRepository.findByEmailInsensitive(email);

      if (!patient) {
        return { message: 'If email exists, OTP has been sent' };
      }

      await this.otpNotificationService.sendOtpEmail(email, 'Password Reset');

      return { message: 'If email exists, OTP has been sent' };
    } catch (error: unknown) {
      this.logger.error('Forgot password failed', {
        email: dto.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* RESET PASSWORD - VERIFY OTP + UPDATE PASSWORD */
  /* -------------------------------------------------------------------------- */

  async resetPasswordPatient(
    dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const email = dto.email.toLowerCase();

      this.logger.info('Password reset attempt', { email });

      const patient =
        await this.patientRepository.findByEmailInsensitive(email);

      if (!patient) {
        throw new UnauthorizedException('Invalid request');
      }

      await this.otpNotificationService.verifyOtp(email, dto.otp);

      const hashedPassword = await hashPassword(dto.newPassword);

      await this.patientRepository.update(patient.id, {
        password: hashedPassword,
      });

      this.logger.info('Password reset successful', {
        patientId: patient.id,
      });

      return { message: 'Password reset successful' };
    } catch (error: unknown) {
      this.logger.error('Password reset failed', {
        email: dto.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* GET CURRENT AUTHENTICATED PATIENT */
  /* -------------------------------------------------------------------------- */

  async getMePatient(patientId: string): Promise<PatientAuthResponseDto> {
    try {
      const patient = await this.patientRepository.findById(patientId);

      if (!patient || !patient.isActive) {
        throw new UnauthorizedException('Unauthorized');
      }

      return {
        id: patient.id,
        name: patient.name,
        email: patient.email,
      };
    } catch (error: unknown) {
      if (!(error instanceof UnauthorizedException)) {
        this.logger.error('getMePatient failed', {
          patientId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      throw error;
    }
  }
}
