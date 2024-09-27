import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import {
  SUBSCRIPTION_CREATED,
  SUBSCRIPTION_DELETED,
  SUBSCRIPTION_GET,
  SUBSCRIPTION_GET_COUNT,
} from '@app/shared';
import { TransportManager } from '@user/core/managers/transport.manager';
import { SubsApiService } from '../application/services/subs-api.service';
import { SubscribeCommand } from '../application/use-cases/subscription.use-case';
import { UnsubscribeCommand } from '../application/use-cases/unsubscription.use-case';
import { ValidatePayloadPipe } from '../../../../../fileHub/src/features/file/infrastructure/pipes/input-data-validate.pipe';

import { SubsQueryRepo } from './subs.query.repo';
import {
  InputSubscriptionDto,
  InputUserIdDto,
} from './models/input-models/sub.model';

@Controller('subs')
export class SubsController {
  constructor(
    private subsApiService: SubsApiService,
    private subsQueryRepo: SubsQueryRepo,
    private transportManager: TransportManager,
  ) {}

  @MessagePattern(SUBSCRIPTION_GET)
  async getUserFollowersAndFollowing(
    @Payload(new ValidatePayloadPipe(InputUserIdDto))
    data: InputUserIdDto,
    @Ctx() context: RmqContext,
  ) {
    const followers = await this.subsQueryRepo.getFollowers(data.userId);
    const following = await this.subsQueryRepo.getFollowing(data.userId);

    const payload = {
      followers,
      following,
    };

    return await this.transportManager.sendMessage(
      Transport.RMQ,
      SUBSCRIPTION_GET,
      payload,
    );
  }

  @MessagePattern(SUBSCRIPTION_GET_COUNT)
  async getUserFollowersAndFollowingCount(
    @Payload(new ValidatePayloadPipe(InputUserIdDto))
    data: InputUserIdDto,
    @Ctx() context: RmqContext,
  ) {
    const followersCount = await this.subsQueryRepo.getFollowersCount(
      data.userId,
    );
    const followingCount = await this.subsQueryRepo.getFollowingCount(
      data.userId,
    );
    const payload = {
      followersCount,
      followingCount,
    };

    return await this.transportManager.sendMessage(
      Transport.RMQ,
      SUBSCRIPTION_GET_COUNT,
      payload,
    );
  }

  @MessagePattern(SUBSCRIPTION_CREATED)
  async subscribe(
    @Payload(new ValidatePayloadPipe(InputSubscriptionDto))
    data: InputSubscriptionDto,
    @Ctx() context: RmqContext,
  ) {
    const command = new SubscribeCommand(data);

    return this.subsApiService.handleEvent(command, context);
  }

  @MessagePattern(SUBSCRIPTION_DELETED)
  async unsubscribe(
    @Payload(new ValidatePayloadPipe(InputSubscriptionDto))
    data: InputSubscriptionDto,
    @Ctx() context: RmqContext,
  ) {
    const command = new UnsubscribeCommand(data);
    return this.subsApiService.handleEvent(command, context);
  }
}
