import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LayerNoticeInterceptor } from '@app/shared';
import { InputSubscriptionDto } from '../../api/models/input-models/sub.model';
import { SubsRepository } from '../../domain/subs-repository';

export class UnsubscribeCommand {
  constructor(public subDto: InputSubscriptionDto) {}
}

@CommandHandler(UnsubscribeCommand)
export class UnsubscribeUseCase implements ICommandHandler<UnsubscribeCommand> {
  private location = this.constructor.name;
  constructor(private subsRepo: SubsRepository) {}

  async execute(command: UnsubscribeCommand) {
    const notice = new LayerNoticeInterceptor<any>();

    const subscription = await this.subsRepo.getSubscription(command.subDto);

    if (!subscription) {
      notice.addError(
        `user's subscription was not founded`,
        this.location,
        notice.errorCodes.ResourceNotFound,
      );
    }
    const deletedSubscription = await this.subsRepo.delete(subscription.id);
    
    return notice;
  }
}
