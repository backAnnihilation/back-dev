import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUserId } from '@user/core/decorators/current-user-id.decorator';

import { SubsCudApiService } from '../application/services/subs-api.service';
import { SubscribeCommand } from '../application/use-cases/subscription.use-case';
import { UnsubscribeCommand } from '../application/use-cases/unsubscription.use-case';
import { ValidatePayloadPipe } from '../infrastructure/pipes/input-data-validate.pipe';
import { SubscriptionService } from '../application/services/subs-service';
import { AccessTokenGuard } from '../../auth/infrastructure/guards/accessToken.guard';

import { SubsQueryRepo } from './subs.query.repo';
import {
  InputSubscriptionDto,
  InputUserIdDto,
} from './models/input-models/sub.model';
import { ViewSubs, ViewSubsCount } from './models/output-models/view-sub.model';
import { ApiTagsEnum, RoutingEnum } from '@app/shared';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(ApiTagsEnum.Subs)
@Controller(RoutingEnum.subs)
export class SubsController {
  constructor(
    private subsApiService: SubsCudApiService,
    private subsQueryRepo: SubsQueryRepo,
    private subsService: SubscriptionService,
  ) {}

  @Get(':userId')
  async getUserFollowersAndFollowing(
    @Param('userId') userId: string,
  ): Promise<ViewSubs> {
    const followers = await this.subsQueryRepo.getFollowers(userId);
    const following = await this.subsQueryRepo.getFollowing(userId);

    const payload = {
      followers,
      following,
    };

    return payload;
  }

  @Get('count/:userId')
  async getUserFollowersAndFollowingCount(
    @Param('userId') userId: string,
  ): Promise<ViewSubsCount> {
    const payload =
      await this.subsService.getUserFollowersAndFollowingCount(userId);
    return payload;
  }

  @Post(':followingId')
  @UseGuards(AccessTokenGuard)
  async subscribe(
    @CurrentUserId() userId: string,
    @Param('followingId') followingId: string,
  ) {
    const command = new SubscribeCommand({
      followingId,
      followerId: userId,
    });

    return this.subsApiService.updateOrDelete(command);
  }

  @Delete(':following')
  @UseGuards(AccessTokenGuard)
  async unsubscribe(
    @CurrentUserId() userId: string,
    @Param('followingId') followingId: string,
  ) {
    const command = new UnsubscribeCommand({
      followingId,
      followerId: userId,
    });

    return this.subsApiService.updateOrDelete(command);
  }
}
