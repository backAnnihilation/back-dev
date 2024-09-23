import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TcpOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class TcpService {
  constructor(private configService: ConfigService) {}

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
