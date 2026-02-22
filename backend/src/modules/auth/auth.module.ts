import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/access-token.strategy';
import { JwtAuthGuard } from './gaurds/jwt-auth.gaurd';
import { RolesGuard } from './gaurds/roles.gaurd';

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
