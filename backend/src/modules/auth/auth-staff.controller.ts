import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';

import { AuthStaffService } from './auth-staff.service';
import { StaffLoginDto } from './dto/staff-login.dto';
import { JwtAuthGuard } from './gaurds/jwt-auth.gaurd';
import { CurrentUser } from 'src/common/decorators';
import { getAccessCookieOptions } from 'src/common/utils/auth/cookie.util';
import { ConfigService } from 'src/config/config.service';
import { StaffAuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth - Staff')
@Controller({ path: 'auth/staff', version: '1' })
export class AuthStaffController {
  constructor(
    private readonly authStaffService: AuthStaffService,
    private readonly configService: ConfigService,
  ) {}

  /* =========================================================
     LOGIN
  ========================================================= */

  @Post('login')
  @ApiOperation({ summary: 'Staff login' })
  @ApiBody({ type: StaffLoginDto })
  @ApiResponse({
    status: 200,
    description:
      'Login successful. Returns staff user and sets HttpOnly cookie.',
    type: StaffAuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  async login(
    @Body() dto: StaffLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StaffAuthResponseDto> {
    const { accessToken, user } = await this.authStaffService.login(dto);

    res.cookie(
      this.configService.get('AUTH_COOKIE_NAME'),
      accessToken,
      getAccessCookieOptions(this.configService),
    );

    return user;
  }

  /* =========================================================
     LOGOUT
  ========================================================= */

  @Post('logout')
  @ApiOperation({ summary: 'Logout staff user' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful. Auth cookie cleared.',
  })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authStaffService.logout(res);
  }

  /* =========================================================
     ME
  ========================================================= */

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get currently logged-in staff user' })
  @ApiCookieAuth() // shows cookie-based auth in Swagger
  @ApiResponse({
    status: 200,
    description: 'Current staff user returned successfully',
    type: StaffAuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (invalid or missing token)',
  })
  async getMe(@CurrentUser('id') id: string): Promise<StaffAuthResponseDto> {
    return this.authStaffService.getMe(id);
  }
}
