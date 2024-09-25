import { CommandBus } from '@nestjs/cqrs';
import { LayerNoticeInterceptor } from '@app/shared';

export interface BaseQueryRepository<T> {
  getById: (id: string) => Promise<T>;
}

export interface BaseViewModel {
  id: string;
}

export class BaseCUDApiService<TCommand, TViewModel> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepo: BaseQueryRepository<TViewModel>,
  ) {}

  private async handleCommand(
    command: TCommand,
    shouldReturnViewModel = false,
  ): Promise<TViewModel | void> {
    const notification = await this.commandBus.execute<
      TCommand,
      LayerNoticeInterceptor<TViewModel & BaseViewModel>
    >(command);

    if (notification.hasError) {
      throw notification.generateErrorResponse;
    }

    if (shouldReturnViewModel) {
      return this.queryRepo.getById(notification.data.id);
    }
  }

  async create(command: TCommand): Promise<TViewModel> {
    return this.handleCommand(command, true) as Promise<TViewModel>;
  }

  async updateOrDelete(command: TCommand): Promise<void> {
    await this.handleCommand(command);
  }
}
