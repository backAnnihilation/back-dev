import { EVENT_COMMANDS, EVENTS_SERVICE, FILES_SERVICE } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TransportPayload } from '../managers/transport.manager';

@Injectable()
export class RmqAdapter {
  constructor(
    @Inject(FILES_SERVICE) private filesClient: ClientProxy,
    @Inject(EVENTS_SERVICE) private eventsClient: ClientProxy,
  ) {}

  private getClient(command: EVENT_COMMANDS) {
    return command === EVENT_COMMANDS.PROFILE_IMAGE_UPLOAD
      ? this.filesClient
      : this.eventsClient;
  }

  async sendMessage(
    command: EVENT_COMMANDS,
    payload: TransportPayload,
  ): Promise<void> {
    try {
      const client = this.getClient(command);
      return void client.emit(command, payload);
    } catch (error) {
      console.log(`Send message to file service corrupted with error:`, error);
    }
  }
}
