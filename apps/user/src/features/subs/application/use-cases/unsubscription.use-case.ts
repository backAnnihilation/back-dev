import { LayerNoticeInterceptor } from '@app/shared';
import { Transactional } from '@nestjs-cls/transactional';
import { CommandHandler } from '@nestjs/cqrs';
import { SubStatus } from '@prisma/client';
import { BaseUseCase } from '../../../../core/application/use-cases/base-use-case';
import { FollowCountOperation } from '../../../profile/api/models/input/follow-counts.model';
import { ProfilesRepository } from '../../../profile/infrastructure/profiles.repository';
import { InputSubscriptionDto } from '../../api/models/input-models/sub.model';
import { SubsRepository } from '../../domain/subs.repository';

export class UnsubscribeCommand {
  constructor(public subDto: InputSubscriptionDto) {}
}

@CommandHandler(UnsubscribeCommand)
export class UnsubscribeUseCase extends BaseUseCase<UnsubscribeCommand, null> {
  private location = this.constructor.name;
  constructor(
    private subsRepo: SubsRepository,
    private profilesRepo: ProfilesRepository,
  ) {
    super();
  }

  @Transactional()
  async onExecute(command: UnsubscribeCommand) {
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
