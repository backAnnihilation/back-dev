import { EVENT_COMMANDS, FILES_SERVICE } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TransportPayload } from '../managers/transport.manager';

@Injectable()
export class RmqAdapter {
  constructor(@Inject(FILES_SERVICE) private rmqClient: ClientProxy) {}

  async sendMessage(
    command: EVENT_COMMANDS,
    payload: TransportPayload,
  ): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.rmqClient.send(command, payload),
      );
      console.log({ response });
      return response;
    } catch (error) {
      console.log(`Send message to file service corrupted with error:`, error);
    }
  }
}
