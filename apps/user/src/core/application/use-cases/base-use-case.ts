import { LayerNoticeInterceptor } from '@app/shared';
import { ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export type PrismaTransactionClient = Prisma.TransactionClient;

export abstract class BaseUseCase<TCommand, TResponse>
  implements ICommandHandler<TCommand>
{
  protected abstract onExecute(
    command: TCommand,
  ): Promise<LayerNoticeInterceptor<TResponse>>;

  async execute(command: TCommand): Promise<LayerNoticeInterceptor<TResponse>> {
    return await this.launch(command);
  }

  private async launch(
    command: TCommand,
  ): Promise<LayerNoticeInterceptor<TResponse>> {
    let notice = new LayerNoticeInterceptor<TResponse>();
    try {
      notice = await this.onExecute(command);
    } catch (error) {
      notice.addError(
        error?.message ||
          `unexpected error during execute ${command.constructor.name}`,
        BaseUseCase.name,
        notice.errorCodes.InternalServerError,
      );
    }
    return notice;
  }
}
