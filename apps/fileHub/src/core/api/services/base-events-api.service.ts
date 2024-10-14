import { LayerNoticeInterceptor, RmqService } from '@app/shared';
import { CommandBus } from '@nestjs/cqrs';
import { RmqContext, TcpContext } from '@nestjs/microservices';

export class BaseEventsApiService<TCommand> {
  constructor(
    private readonly rmqService: RmqService,
    private readonly commandBus: CommandBus,
  ) {}

  protected async handleEvent(
    command: TCommand,
    context: RmqContext | TcpContext,
    withResponse = false,
  ): Promise<void> {
    if (context instanceof RmqContext) {
      this.rmqService.ack(context);
    }

    const notification = await this.commandBus.execute<
      TCommand,
      LayerNoticeInterceptor<any>
    >(command);

    if (notification.hasError) {
      throw notification.generateErrorResponse;
    }

    if (withResponse) return notification.data;
  }
}
