import { EVENT_COMMANDS, FILES_SERVICE } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RMQAdapter {
  constructor(@Inject(FILES_SERVICE) private rmqClient: ClientProxy) {}

  async sendMessage(payload: any, command: EVENT_COMMANDS | any): Promise<any> {
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
