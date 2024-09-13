import {
  EVENT_CMD,
  EVENT_COMMANDS,
  FILES_SERVICE,
} from '@models/enum/queue-tokens';
import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, pipe, timeout, tap, TimeoutError } from 'rxjs';

@Injectable()
export class RMQAdapter {
  constructor(@Inject(FILES_SERVICE) private rmqClient: ClientProxy) {}

  async sendMessage(payload: any, command: EVENT_COMMANDS): Promise<any> {
    try {
      return await lastValueFrom(
        this.rmqClient.send(EVENT_CMD[command], payload).pipe(timeout(4000)),
      );
    } catch (error) {
      if (error instanceof TimeoutError) {
        console.log('Send message to file service timed out');
        throw new ServiceUnavailableException('Service temporarily unavailable, please try again later.')
      } else {
        console.log('Send message to file service failed with error:', error);
        throw new Error(
          'An error occurred while sending the message. Please try again later.',
        );
      }
    }
  }
}
