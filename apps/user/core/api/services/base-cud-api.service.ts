import { CommandBus } from '@nestjs/cqrs';
import { handleErrors } from '../../../../../libs/shared/handle-response-errors';
import { LayerNoticeInterceptor } from '../../../../../libs/shared/notification';

export interface BaseQueryRepository<T> {
  getById: (id: string) => Promise<T>;
}

export interface BaseViewModel {
  id?: string;
}

export class BaseCUDApiService<TCommand, TViewModel> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepo: BaseQueryRepository<TViewModel>,
  ) {}
  async create(command: TCommand): Promise<TViewModel> {
    const notification = await this.commandBus.execute<
      TCommand,
      LayerNoticeInterceptor<TViewModel & BaseViewModel>
    >(command);

    if (notification.hasError) {
      const { error } = handleErrors(
        notification.code,
        notification.extensions[0],
      );
      throw error;
    }

    return this.queryRepo.getById(notification.data.id);
  }
  async updateOrDelete(command: TCommand): Promise<void> {
    const notification = await this.commandBus.execute<
      TCommand,
      LayerNoticeInterceptor
    >(command);

    if (notification.hasError) {
      const { error } = handleErrors(
        notification.code,
        notification.extensions[0],
      );
      throw error;
    }
  }
}
