import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { EnvironmentVariables } from '../../../core/config/configuration';
import { UserSessionDto } from '../../security/api/models/security-input.models/security-session-info.model';
import {
  IPayload,
  JwtTokens,
} from '../api/models/auth-input.models.ts/jwt.types';

@Injectable()
export class AuthService {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    this.accessTokenSecret = this.configService.get('ACCESS_TOKEN_SECRET');
    this.refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET');
  }

  async createTokenPair(userId: string): Promise<JwtTokens> {
    const deviceId = uuidv4();
    const payload = { userId, deviceId };
    const [accessToken, refreshToken] = await this.createNewTokens(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  getUserPayloadByToken(token: string): IPayload | null {
    try {
      return this.jwtService.decode(token) as IPayload;
    } catch (error) {
      console.error(`Troubleshoots with getting user's payload`, error);
      return null;
    }
  }

  async updateUserTokens(userId: string, deviceId: string): Promise<JwtTokens> {
    const payload = { userId, deviceId };
    const [accessToken, refreshToken] = await this.createNewTokens(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createNewTokens(
    payload: UserSessionDto,
  ): Promise<[accessToken: string, refreshToken: string]> {
    return Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.accessTokenSecret,
        expiresIn: '10h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refreshTokenSecret,
        expiresIn: '20h',
      }),
    ]);
  }
}
