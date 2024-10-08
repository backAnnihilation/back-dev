import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LayerNoticeInterceptor } from '@app/shared';

import { InputSubscriptionDto } from '../../api/models/input-models/sub.model';
import { SubsRepository } from '../../domain/subs-repository';

export class SubscribeCommand {
  constructor(public subDto: InputSubscriptionDto) {}
}

@CommandHandler(SubscribeCommand)
export class SubscribeUseCase implements ICommandHandler<SubscribeCommand> {
  private location = this.constructor.name;
  constructor(private subsRepo: SubsRepository) {}

  async execute(command: SubscribeCommand) {
    const notice = new LayerNoticeInterceptor<any>();

    const subscription = await this.subsRepo.create(command.subDto);

    if (!subscription) {
      notice.addError(
        'UserSubscription was not created',
        this.location,
        notice.errorCodes.InternalServerError,
      );
      return notice;
    }

    return notice;
  }
}
