import { EVENT_COMMANDS, FILES_SERVICE, TCP_FILES_SERVICE } from '@app/shared';
import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TransportPayload } from '../managers/transport.manager';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TcpAdapter {
  constructor(
    @Inject(TCP_FILES_SERVICE)
    private tcpClient: ClientProxy,
  ) {}

  async sendMessage(
    command: EVENT_COMMANDS,
    payload: TransportPayload,
  ): Promise<void> {
    try {
      return void this.tcpClient.emit(command, payload);
    } catch (error) {
      console.log(
        `Send message to file service via tcp corrupted with error:`,
        error,
      );
      throw new ServiceUnavailableException(error);
    }
  }

  async sendMessageAndWaitResponse<T>(
    command: EVENT_COMMANDS,
    payload: TransportPayload,
  ): Promise<T> {
    try {
      return await firstValueFrom(this.tcpClient.send(command, payload));
    } catch (error) {
      console.log(
        `Send message to file service via tcp corrupted with error:`,
        error,
      );
      throw new ServiceUnavailableException(error);
    }
  }
}
