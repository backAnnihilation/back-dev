import { LayerNoticeInterceptor } from '@app/shared';
import { ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export type PrismaTransactionClient = Prisma.TransactionClient;

export abstract class BaseUseCase<TCommand, TOutputResponse>
  implements ICommandHandler<TCommand>
{
  protected abstract onExecute(
    command: TCommand,
  ): Promise<LayerNoticeInterceptor<TOutputResponse>>;

  async execute(
    command: TCommand,
  ): Promise<LayerNoticeInterceptor<TOutputResponse>> {
    return await this.launch(command);
  }

  private async launch(
    command: TCommand,
  ): Promise<LayerNoticeInterceptor<TOutputResponse>> {
    let notice = new LayerNoticeInterceptor<TOutputResponse>();
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
