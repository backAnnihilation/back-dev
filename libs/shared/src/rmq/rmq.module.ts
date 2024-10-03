import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_TOKEN, QUEUE_NAME } from '@app/shared';
import { RmqService } from './rmq.service';

interface RmqModuleOptions {
  name: SERVICE_TOKEN;
  queue: QUEUE_NAME;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name, queue }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (config: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [config.get<string>('RMQ_URL')],
                queue: config.get<string>(queue),
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
