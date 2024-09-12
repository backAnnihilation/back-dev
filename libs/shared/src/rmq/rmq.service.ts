import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private configService: ConfigService) {}

  getOptions = (queue: string, noAck = false): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
      urls: [this.configService.get<string>('RMQ_URL')],
      queue: this.configService.get<string>(`RMQ_${queue.toUpperCase()}_QUEUE`),
      queueOptions: { durable: true },
      noAck,
      persistent: true,
    },
  });

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
