import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@file/core/configuration/configuration';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private config: ConfigService<EnvironmentVariables>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const _apiKey = this.config.get('API_KEY') || '';
    const apiKey = request.headers['x-api-key'];

    if (apiKey !== _apiKey) return false;

    return true;
  }
}
