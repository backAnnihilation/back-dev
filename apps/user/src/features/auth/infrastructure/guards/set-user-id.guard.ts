import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EnvironmentVariables } from '../../../../../core/config/configuration';

@Injectable()
export class SetUserIdGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeaders(request);

    const accessSecret = this.configService.get('ACCESS_TOKEN_SECRET');

    if (accessToken) {
      try {
        const userPayload = await this.jwtService.verifyAsync(accessToken, {
          secret: accessSecret,
        });
        request.userId = userPayload.userId;
      } catch (error) {
        return true;
      }
    }

    return true;
  }

  private extractTokenFromHeaders(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
