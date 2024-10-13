import { PrismaClient } from '@prisma/client';
import { LayerNoticeInterceptor } from '@app/shared';
import * as runtime from '@prisma/client/runtime/library.js';
type PrismaTransactionClient = Omit<PrismaClient, runtime.ITXClientDenyList>;

export abstract class BaseUseCase<TCommand, TOutputResponse> {
  protected constructor(private readonly prisma: PrismaClient) {}

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
    data: TCommand,
  ): Promise<LayerNoticeInterceptor<TOutputResponse>> {
    try {
      const transactionResult = await this.prisma.$transaction(
        async (prisma) => {
          const resultNotification = await this.onExecute(data, prisma);
          if (resultNotification.hasError) {
            throw new Error('Transaction failed due to errors in execution.');
          }

          return resultNotification;
        },
      );

      return transactionResult;
    } catch (error) {
      console.log(BaseUseCase.name, error);
      // Handle the rollback...
    }
  }
}
