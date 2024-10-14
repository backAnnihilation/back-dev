import { EVENT_COMMANDS } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { RmqAdapter, TcpAdapter } from '@user/core';
import { BaseImageResponse } from '@app/shared';

export type BaseTransportResponse = BaseImageResponse;
export type TransportPayload = {
  [key: string]: any;
};
interface ITransportAdapter<RTransport extends BaseTransportResponse> {
  sendMessage: (command: string, payload: any) => Promise<RTransport | void>;
  sendMessageAndWaitResponse: (
    command: string,
    payload: any,
  ) => Promise<RTransport | null>;
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

  async sendMessage(options: TransportOptions): Promise<RTransport | void> {
    const { transport, command, payload, async = true } = options;
    return async
      ? this.adapters[transport].sendMessage(command, payload)
      : this.adapters[transport].sendMessageAndWaitResponse(command, payload);
  }
}

/**
 * @property transport - The transport to use for sending the message.
 * @property command - The command to send.
 * @property payload - The payload to send.
 * @property async - Whether to send the message asynchronously or not.
 */
type TransportOptions = {
  transport: Transport;
  command: EVENT_COMMANDS;
  payload: TransportPayload | string;
  async?: boolean;
};
