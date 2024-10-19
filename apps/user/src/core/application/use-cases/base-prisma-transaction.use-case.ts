import { Prisma, PrismaClient } from '@prisma/client';
import { LayerNoticeInterceptor } from '@app/shared';
import * as runtime from '@prisma/client/runtime/library.js';
import { ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../db';

export type PrismaTransactionClient = Prisma.TransactionClient;

export abstract class BaseUseCase<TCommand, TOutputResponse>
  implements ICommandHandler<TCommand>
{
  protected constructor(protected readonly prisma: PrismaService) {}

  protected abstract onExecute(
    command: TCommand,
    prisma: PrismaTransactionClient,
  ): Promise<LayerNoticeInterceptor<TOutputResponse>>;

  async execute(
    command: TCommand,
  ): Promise<LayerNoticeInterceptor<TOutputResponse>> {
    return await this.launchTransaction(command);
  }

  private async launchTransaction(
    command: TCommand,
  ): Promise<LayerNoticeInterceptor<TOutputResponse>> {
    return await this.prisma.$transaction<
      LayerNoticeInterceptor<TOutputResponse>
    >(async (tx) => {
      try {
        return await this.onExecute(command, tx);
      } catch (error) {
        const notice = new LayerNoticeInterceptor();
        notice.addError(
          error?.message || 'unexpected error during transaction',
          BaseUseCase.name,
          notice.errorCodes.InternalServerError,
        );
        return notice;
      }
    });
  }
}
