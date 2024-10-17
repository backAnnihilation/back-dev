import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LayerNoticeInterceptor, OutputId } from '@app/shared';
import { InputSubscriptionDto } from '../../api/models/input-models/sub.model';
import { SubsRepository } from '../../domain/subs.repository';
import { ProfilesRepository } from '../../../profile/infrastructure/profiles.repository';
import { FollowCountOperation } from '../../../profile/api/models/input/follow-counts.model';
import { SubStatus } from '@prisma/client';

export class SubscribeCommand {
  constructor(public subDto: InputSubscriptionDto) {}
}

@CommandHandler(SubscribeCommand)
export class SubscribeUseCase implements ICommandHandler<SubscribeCommand> {
  private location = this.constructor.name;
  constructor(
    private subsRepo: SubsRepository,
    private profilesRepo: ProfilesRepository,
  ) {}

  async execute(
    command: SubscribeCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    const notice = new LayerNoticeInterceptor<OutputId>();
    const { followerId, followingId } = command.subDto;

    if (followerId === followingId) {
      notice.addError(
        'You cannot subscribe to yourself',
        this.location,
        notice.errorCodes.ValidationError,
      );
      return notice;
    }

    const subExists = await this.subsRepo.findFollowerSubscription(
      command.subDto,
    );

    if (subExists) {
      if (subExists.status === SubStatus.active) {
        notice.addError(
          'Already subscribed',
          this.location,
          notice.errorCodes.ValidationError,
        );
        return notice;
      }
      if (subExists.status === SubStatus.inactive) {
        await this.subsRepo.updateStatus(subExists.id, SubStatus.active);
      }

      await this.profilesRepo.updateFollowerAndFollowingCounts({
        followerId,
        followingId,
        operation: FollowCountOperation.INCREMENT,
      });
      notice.addData({ id: subExists.id });
      return notice;
    }

    const subscription = await this.subsRepo.create(command.subDto);

    await this.profilesRepo.updateFollowerAndFollowingCounts({
      followerId,
      followingId,
      operation: FollowCountOperation.INCREMENT,
    });

    notice.addData({ id: subscription.id });
    return notice;
  }
}
