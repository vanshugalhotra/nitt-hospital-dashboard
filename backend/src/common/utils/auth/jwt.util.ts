import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';

export interface AuthJwtPayload {
  sub: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export const generateAccessToken = (
  jwtService: JwtService,
  config: ConfigService,
  user: { id: string; email: string; role: string },
): string => {
  const secret = config.get('JWT_ACCESS_SECRET');
  const expiresIn = config.get('JWT_ACCESS_EXPIRES_IN') ?? '15m';

  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET not configured');
  }

  const payload: AuthJwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    type: 'access',
  };

  return jwtService.sign(payload, {
    secret,
    expiresIn,
  });
};

export const generateRefreshToken = (
  jwtService: JwtService,
  config: ConfigService,
  user: { id: string; email: string; role: string },
): string => {
  const secret = config.get('JWT_REFRESH_SECRET');
  const expiresIn = config.get('JWT_REFRESH_EXPIRES_IN') ?? '7d';

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  const payload: AuthJwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    type: 'refresh',
  };

  return jwtService.sign(payload, {
    secret,
    expiresIn,
  });
};

export const verifyToken = (
  jwtService: JwtService,
  config: ConfigService,
  token: string,
  type: 'access' | 'refresh',
): AuthJwtPayload => {
  const secret =
    type === 'access'
      ? config.get('JWT_ACCESS_SECRET')
      : config.get('JWT_REFRESH_SECRET');

  if (!secret) {
    throw new Error('JWT secret not configured properly');
  }

  try {
    return jwtService.verify<AuthJwtPayload>(token, { secret });
  } catch {
    throw new Error('Invalid or expired token');
  }
};
