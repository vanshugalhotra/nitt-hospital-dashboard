import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/gaurds/jwt-auth.gaurd';
import { PermissionsGuard } from 'src/modules/auth/gaurds/permission.gaurd';
import { Permission } from 'src/modules/auth/decorators/permission.decorator';
import { PERMISSIONS } from 'src/modules/auth/rbac/role-permissions.map';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'otps', version: '1' })
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  /* -------------------------------------------------------------------------- */
  /* ADMIN: READ ALL */
  /* -------------------------------------------------------------------------- */

  @Get()
  @UseGuards(PermissionsGuard)
  @Permission(PERMISSIONS.OTP_MANAGE)
  async getAll() {
    return this.otpService.getAll();
  }

  /* -------------------------------------------------------------------------- */
  /* ADMIN: MANUAL CREATE */
  /* -------------------------------------------------------------------------- */

  @Post('create')
  @UseGuards(PermissionsGuard)
  @Permission(PERMISSIONS.OTP_MANAGE)
  async createManual(
    @Body()
    body: {
      email: string;
    },
  ) {
    return this.otpService.generateOtp(body.email);
  }

  /* -------------------------------------------------------------------------- */
  /* ADMIN: MARK USED */
  /* -------------------------------------------------------------------------- */

  @Patch(':id/mark-used')
  @UseGuards(PermissionsGuard)
  @Permission(PERMISSIONS.OTP_MANAGE)
  async markUsed(@Param('id') id: string) {
    return this.otpService.markUsed(id);
  }

  /* -------------------------------------------------------------------------- */
  /* ADMIN: DELETE ONE */
  /* -------------------------------------------------------------------------- */

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permission(PERMISSIONS.OTP_MANAGE)
  async deleteOne(@Param('id') id: string) {
    return this.otpService.deleteOne(id);
  }

  /* -------------------------------------------------------------------------- */
  /* ADMIN: DELETE EXPIRED */
  /* -------------------------------------------------------------------------- */

  @Delete('cleanup/expired')
  @UseGuards(PermissionsGuard)
  @Permission(PERMISSIONS.OTP_MANAGE)
  async deleteExpired() {
    return this.otpService.deleteExpired();
  }
}
