import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { TcpAdapter, RmqAdapter } from '@user/core/adapters';
import { EVENT_COMMANDS } from '@app/shared';

export type BaseTransportResponse = {
  url: string;
  id: string;
};
export type TransportPayload = {
  [key: string]: any;
};
interface ITransportAdapter<RTransport extends BaseTransportResponse> {
  sendMessage: (command: string, payload: any) => Promise<RTransport>;
}

@Injectable()
export class TransportManager<
  RTransport extends BaseTransportResponse = BaseTransportResponse,
> {
  private adapters: Partial<Record<Transport, ITransportAdapter<RTransport>>>;
  constructor(tcpAdapter: TcpAdapter, rmqAdapter: RmqAdapter) {
    this.adapters = {
      [Transport.TCP]: tcpAdapter,
      [Transport.RMQ]: rmqAdapter,
    };
  }

  async sendMessage(
    transport: Transport,
    command: EVENT_COMMANDS,
    payload: TransportPayload,
  ): Promise<any> {
    return this.adapters[transport].sendMessage(command, payload);
  }
}
