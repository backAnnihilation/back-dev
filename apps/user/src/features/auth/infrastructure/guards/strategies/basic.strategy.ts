import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy } from 'passport-http';

import { EnvironmentVariable } from '../../../../../core/config/configuration';

@Injectable()
export class BasicSAStrategy extends PassportStrategy(BasicStrategy) {
  private password: string;
  private userName: string;
  constructor(private configService: ConfigService<EnvironmentVariable>) {
    super();
    this.password = this.configService.get('BASIC_AUTH_PASSWORD');
    this.userName = this.configService.get('BASIC_AUTH_USERNAME');
  }

  public validate = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    if (this.userName === username && this.password === password) return true;

    throw new UnauthorizedException();
  };
}
