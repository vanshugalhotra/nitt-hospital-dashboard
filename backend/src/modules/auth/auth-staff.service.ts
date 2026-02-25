import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { StaffRepository } from '../staff/repository/staff.repository';
import { StaffLoginDto } from './dto/staff-login.dto';
import { StaffAuthResponseDto } from './dto/auth-response.dto';

import { verifyPassword } from 'src/common/utils/auth/password.util';
import { generateAccessToken } from 'src/common/utils/auth/jwt.util';
import { clearAuthCookie } from 'src/common/utils/auth/cookie.util';

import { ConfigService } from 'src/config/config.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AuthStaffService {
  private readonly entity = 'AuthStaff';

  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  /* -------------------------------------------------------------------------- */
  /* STAFF LOGIN  */
  /* -------------------------------------------------------------------------- */

  async login(dto: StaffLoginDto): Promise<{
    accessToken: string;
    user: StaffAuthResponseDto;
  }> {
    try {
      this.logger.info('Staff login attempt', {
        email: dto.email,
      });

      const staff = await this.staffRepository.findByEmail(
        dto.email.toLowerCase(),
        true,
      );

      if (!staff) {
        this.logger.warn('Login failed: email not found', {
          email: dto.email,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await verifyPassword(
        dto.password,
        staff.password,
      );

      if (!isPasswordValid) {
        this.logger.warn('Login failed: incorrect password', {
          email: dto.email,
          staffId: staff.id,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      const accessToken = generateAccessToken(
        this.jwtService,
        this.configService,
        {
          id: staff.id,
          email: staff.email,
          type: 'staff',
          role: staff.role,
        },
      );

      this.logger.info('Staff login successful', {
        staffId: staff.id,
        email: staff.email,
        role: staff.role,
      });

      return {
        accessToken,
        user: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
        },
      };
    } catch (error: unknown) {
      if (!(error instanceof UnauthorizedException)) {
        this.logger.error('Unexpected error during login', {
          email: dto.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      throw error;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* STAFF LOGOUT  */
  /* -------------------------------------------------------------------------- */

  logout(res: Response): { message: string } {
    try {
      this.logger.info('Staff logout initiated');

      clearAuthCookie(res, this.configService);

      this.logger.info('Staff logout successful');

      return { message: 'Logged out successfully' };
    } catch (error: unknown) {
      this.logger.error('Logout failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new UnauthorizedException('Logout failed');
    }
  }

  /* -------------------------------------------------------------------------- */
  /* STAFF GET ME */
  /* -------------------------------------------------------------------------- */

  async getMe(staffId: string): Promise<StaffAuthResponseDto> {
    try {
      this.logger.debug('Fetching authenticated staff user', { staffId });

      const staff = await this.staffRepository.findById(staffId);

      if (!staff || !staff.isActive) {
        this.logger.warn('getMe failed: invalid or inactive user', {
          staffId,
        });
        throw new UnauthorizedException('Unauthorized');
      }

      this.logger.debug('Authenticated staff user fetched successfully', {
        staffId: staff.id,
      });

      return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      };
    } catch (error: unknown) {
      if (!(error instanceof UnauthorizedException)) {
        this.logger.error('Error fetching authenticated staff user', {
          staffId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      throw error;
    }
  }
}
