import { DynamicModule, Module } from '@nestjs/common';
import { TcpService } from './tcp.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

interface TcpModuleOptions {
  name: string;
  port?: number;
  host?: string;
}

@Module({
  providers: [TcpService],
  exports: [TcpService],
})
export class TcpModule {
  static register({ name }: TcpModuleOptions): DynamicModule {
    return {
      module: TcpModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (config: ConfigService) => ({
              transport: Transport.TCP,
              options: {
                host: config.get<string>('TCP_HOST') || '127.0.0.1',
                port: config.get<number>(`TCP_PORT`),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
