import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EnvironmentVariables } from '@user/core/config/configuration';

@Injectable()
export class UserIdExtractor implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeaders(request);
    const exit = true;

    const accessSecret = this.configService.get('ACCESS_TOKEN_SECRET');

    if (accessToken) {
      try {
        const userPayload = await this.jwtService.verifyAsync(accessToken, {
          secret: accessSecret,
        });
        const user = { userId: userPayload.userId };
        request.user = user;
      } catch (error) {
        return exit;
      }
    }

    return exit;
  }

  private extractTokenFromHeaders(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
