import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/access-token.strategy';
import { JwtAuthGuard } from './gaurds/jwt-auth.gaurd';
import { RolesGuard } from './gaurds/roles.gaurd';
import { StaffRepository } from '../staff/repository/staff.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PassportModule],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    StaffRepository,
    AuthService,
    JwtService,
  ],
  exports: [JwtAuthGuard, RolesGuard, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
