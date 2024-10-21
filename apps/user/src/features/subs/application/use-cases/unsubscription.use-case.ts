import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LayerNoticeInterceptor } from '@app/shared';
import { InputSubscriptionDto } from '../../api/models/input-models/sub.model';
import { SubsRepository } from '../../domain/subs.repository';
import { ProfilesRepository } from '../../../profile/infrastructure/profiles.repository';
import { SubStatus } from '@prisma/client';
import { FollowCountOperation } from '../../../profile/api/models/input/follow-counts.model';

export class UnsubscribeCommand {
  constructor(public subDto: InputSubscriptionDto) {}
}

@CommandHandler(UnsubscribeCommand)
export class UnsubscribeUseCase implements ICommandHandler<UnsubscribeCommand> {
  private location = this.constructor.name;
  constructor(
    private subsRepo: SubsRepository,
    private profilesRepo: ProfilesRepository,
  ) {}

  async execute(command: UnsubscribeCommand) {
    const notice = new LayerNoticeInterceptor<any>();
    const { followerId, followingId } = command.subDto;

    if (followerId === followingId) {
      notice.addError(
        `followerId and followingId must be different`,
        this.location,
        notice.errorCodes.ValidationError,
      );
    }

    const subscription = await this.subsRepo.findFollowerSubscription(
      command.subDto,
    );

    if (!subscription) {
      notice.addError(
        'Subscription was not found',
        this.location,
        notice.errorCodes.ResourceNotFound,
      );
      return notice;
    }
    if (subscription.status !== SubStatus.active) {
      notice.addError(
        'Subscription is already inactive',
        this.location,
        notice.errorCodes.ValidationError,
      );
      return notice;
    }

    await this.subsRepo.updateStatus(subscription.id, SubStatus.inactive);

    await this.profilesRepo.updateFollowerAndFollowingCounts({
      followerId,
      followingId,
      operation: FollowCountOperation.DECREMENT,
    });

    return notice;
  }
}
