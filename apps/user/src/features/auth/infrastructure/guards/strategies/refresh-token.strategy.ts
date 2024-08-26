import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { EnvironmentVariables } from '../../../../../../core/config/configuration';
import { Request } from 'express';
import { StrategyType } from '../../../../../../core/infrastructure/guards/models/strategy.enum';
import { SecurityRepository } from '../../../../security/infrastructure/security.repository';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  StrategyType.RefreshToken,
) {
  constructor(
    private securityRepo: SecurityRepository,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    const { iat, deviceId, userId } = payload;

    const tokenIssuedAt = new Date(iat * 1000).toISOString();

    const userSession = await this.securityRepo.getSession(userId, deviceId);

    const lastActiveDate = userSession?.rtIssuedAt?.toISOString();

    if (!userSession || tokenIssuedAt !== lastActiveDate) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { ...payload };
  }
}
const cookieExtractor = (request: Request): string => {
  return request.cookies.refreshToken || request.headers.cookie?.split('=')[1];
};
