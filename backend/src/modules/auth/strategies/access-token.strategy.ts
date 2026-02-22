import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from 'src/config/config.service';
import { AuthJwtPayload } from 'src/common/utils/auth/jwt.util';

interface Cookies {
  [key: string]: string;
}

const cookieExtractor = (config: ConfigService) => {
  return (req: Request): string | null => {
    if (req?.cookies) {
      const cookieName = config.get('AUTH_COOKIE_NAME') || 'access_token';
      // Cast cookies to the defined type
      const cookies = req.cookies as Cookies;
      return cookies[cookieName] || null;
    }
    return null;
  };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor(config)]),
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload): {
    userId: string;
    email: string;
    role: string;
  } {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
