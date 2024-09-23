import { EVENT_COMMANDS, FILES_SERVICE, SERVICE_TOKEN } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TcpAdapter {
  constructor(@Inject(SERVICE_TOKEN.FILES) private tcpClient: ClientProxy) {}

  async sendMessage(payload?: any, command?: EVENT_COMMANDS): Promise<any> {
    try {
      console.log(this.tcpClient);

      const response = await lastValueFrom(
        this.tcpClient.send('tcp-data', { message: 'olleh hol' }),
      );
      console.log({ response });
      return response;
    } catch (error) {
      console.log(
        `Send message to file service via tcp corrupted with error:`,
        error,
      );
    }
  }
}
