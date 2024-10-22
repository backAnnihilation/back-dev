import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { EnvironmentVariables } from '@user/core';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyType } from '../strategies.enum';
import { SecurityQueryRepo } from '../../../../security/api/query-repositories/security.query.repo';
import { IPayload } from '../../../api/models/auth-input.models.ts/jwt.types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  StrategyType.AccessToken,
) {
  constructor(
    private securityQueryRepo: SecurityQueryRepo,
    configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IPayload) {
    const userSession = await this.securityQueryRepo.getUserSession(
      payload.deviceId,
    );
    if (!userSession) return false;
    return { ...payload };
  }
}
