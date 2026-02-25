import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';

import { AuthPatientService } from './auth-patient.service';
import {
  RegisterPatientDto,
  PatientLoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/patient-auth.dto';

import { JwtAuthGuard } from './gaurds/jwt-auth.gaurd';
import { CurrentUser } from 'src/common/decorators';
import { getAccessCookieOptions } from 'src/common/utils/auth/cookie.util';
import { ConfigService } from 'src/config/config.service';
import { PatientAuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth - Patient')
@Controller({ path: 'auth/patient', version: '1' })
export class AuthPatientController {
  constructor(
    private readonly authPatientService: AuthPatientService,
    private readonly configService: ConfigService,
  ) {}

  /* =========================================================
     REGISTER - STEP 1 (REQUEST OTP)
  ========================================================= */

  @Post('register/request-otp')
  @ApiOperation({ summary: 'Request OTP for patient registration' })
  @ApiBody({
    schema: {
      example: {
        email: 'patient@example.com',
        identifier: 'P12345',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async requestRegistrationOtp(
    @Body() dto: { email: string; identifier: string },
  ): Promise<{ message: string }> {
    return this.authPatientService.requestRegistrationOtp(dto);
  }

  /* =========================================================
     REGISTER - STEP 2 (VERIFY OTP + CREATE ACCOUNT)
  ========================================================= */

  @Post('register/verify')
  @ApiOperation({
    summary: 'Verify OTP and complete patient registration',
  })
  @ApiBody({
    type: RegisterPatientDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Registration successful',
  })
  async verifyAndRegister(
    @Body() dto: RegisterPatientDto & { otp: string },
  ): Promise<{ message: string }> {
    return this.authPatientService.verifyAndRegisterPatient(dto);
  }

  /* =========================================================
     LOGIN
  ========================================================= */

  @Post('login')
  @ApiOperation({ summary: 'Patient login' })
  @ApiBody({ type: PatientLoginDto })
  @ApiResponse({
    status: 200,
    description:
      'Login successful. Returns patient user and sets HttpOnly cookie.',
    type: PatientAuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  async login(
    @Body() dto: PatientLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PatientAuthResponseDto> {
    const { accessToken, user } =
      await this.authPatientService.loginPatient(dto);

    res.cookie(
      this.configService.get('AUTH_COOKIE_NAME'),
      accessToken,
      getAccessCookieOptions(this.configService),
    );

    return user;
  }

  /* =========================================================
     FORGOT PASSWORD - REQUEST OTP
  ========================================================= */

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request OTP for password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'If email exists, OTP has been sent',
  })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authPatientService.forgotPasswordPatient(dto);
  }

  /* =========================================================
     RESET PASSWORD (VERIFY OTP + UPDATE PASSWORD)
  ========================================================= */

  @Post('reset-password')
  @ApiOperation({ summary: 'Verify OTP and reset password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
  })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authPatientService.resetPasswordPatient(dto);
  }

  /* =========================================================
     LOGOUT
  ========================================================= */

  @Post('logout')
  @ApiOperation({ summary: 'Logout patient user' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful. Auth cookie cleared.',
  })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.configService.get('AUTH_COOKIE_NAME'));
    return { message: 'Logout successful' };
  }

  /* =========================================================
     ME
  ========================================================= */

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get currently logged-in patient user' })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Current patient returned successfully',
    type: PatientAuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getMe(@CurrentUser('id') id: string): Promise<PatientAuthResponseDto> {
    return this.authPatientService.getMePatient(id);
  }
}
