import { EVENT_COMMANDS, FILES_SERVICE, SERVICE_TOKEN } from '@app/shared';
import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TransportPayload } from '../managers/transport.manager';

@Injectable()
export class TcpAdapter {
  constructor(@Inject(SERVICE_TOKEN.FILES) private tcpClient: ClientProxy) {}

  async sendMessage(
    command: EVENT_COMMANDS,
    payload: TransportPayload,
  ): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.tcpClient.send(command, payload),
      );
      console.log({ response });
      return response;
    } catch (error) {
      console.log(
        `Send message to file service via tcp corrupted with error:`,
        error,
      );
      throw new ServiceUnavailableException(error);
    }
  }
}
