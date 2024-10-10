import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TcpOptions, Transport } from '@nestjs/microservices';
import { Environment } from '../config/environment.enum';
import { EnvironmentVariables } from '@user/core';

@Injectable()
export class TcpService {
  env: Environment;
  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.env = this.configService.getOrThrow('ENV');
  }

  private getOptions(): TcpOptions {
    const transport = Transport.TCP;
    const host = this.configService.get<string>(`TCP_HOST`) || '127.0.0.1';
    const port = this.configService.getOrThrow<number>(`TCP_PORT`);

    return {
      transport,
      options: {
        host,
        port,
      },
    };
  }

  get connectTcpClient(): TcpOptions {
    return this.getOptions();
  }
}
