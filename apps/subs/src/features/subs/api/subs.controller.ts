import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  TcpContext,
} from '@nestjs/microservices';
import { SUBSCRIPTION_CREATED, SUBSCRIPTION_DELETED } from '@app/shared';

import { SubsApiService } from '../application/services/subs-api.service';
import { SubscribeCommand } from '../application/use-cases/subscription.use-case';
import { UnsubscribeCommand } from '../application/use-cases/unsubscription.use-case';
import { ValidatePayloadPipe } from '../../../../../fileHub/src/features/file/infrastructure/pipes/input-data-validate.pipe';
import { InputProfileImageDto } from '../../../../../fileHub/src/features/file/api/models/input-models/profile-image.model';

import { SubsQueryRepo } from './subs.query.repo';
import { InputSubscriptionDto } from './models/input-models/sub.model';

@Controller('subs')
export class SubsController {
  constructor(
    private subsApiService: SubsApiService,
    private subsQueryRepo: SubsQueryRepo,
  ) {}

  @Get(':userId')
  async getUserFollowersAndFollowing(@Param('userId') userId: string) {
    const followers = await this.subsQueryRepo.getFollowers(userId);
    const following = await this.subsQueryRepo.getFollowing(userId);
    return {
      followers,
      following,
    };
  }

  @Get('count/:userId')
  async getUserFollowersAndFollowingCount(@Param('userId') userId: string) {
    const followers = await this.subsQueryRepo.getFollowersCount(userId);
    const following = await this.subsQueryRepo.getFollowingCount(userId);
    return {
      followersCount: followers,
      followingCount: following,
    };
  }

  @MessagePattern(SUBSCRIPTION_CREATED)
  async subscribe(
    @Payload(new ValidatePayloadPipe(InputSubscriptionDto))
    data: InputSubscriptionDto,
    @Ctx() context: RmqContext,
  ) {
    const command = new SubscribeCommand(data);

    // TODO make SubsApiService like FilesApiService
    return this.subsApiService.create(command);
  }

  @MessagePattern(SUBSCRIPTION_DELETED)
  async unsubscribe(
    @Payload(new ValidatePayloadPipe(InputSubscriptionDto))
    data: InputSubscriptionDto,
    @Ctx() context: RmqContext,
  ) {
    const command = new UnsubscribeCommand(data);
    return this.subsApiService.updateOrDelete(command);
  }
}
