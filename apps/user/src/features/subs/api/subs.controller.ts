import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUserId } from '@user/core';
import { SubsCudApiService } from '../application/services/subs-api.service';
import { SubscribeCommand } from '../application/use-cases/subscribe-to-user.use-case';
import { UnsubscribeCommand } from '../application/use-cases/unsubscription.use-case';
import { AccessTokenGuard } from '../../auth/infrastructure/guards/accessToken.guard';
import { SubsQueryRepository } from './subs.query.repository';
import {
  FollowersView,
  FollowingView,
  SubViewModel,
  ViewSubsCount,
} from './models/output-models/view-sub-types.model';
import { ApiTagsEnum, RoutingEnum } from '@app/shared';
import { ApiTags } from '@nestjs/swagger';
import { GetUserFollowersEndpoint } from './swagger/get-followers.description';
import { SubsNavigate } from '../../../core/routes/subs-navigate';
import { GetUserFollowingEndpoint } from './swagger/get-following.description';
import { SubscribeDoc } from './swagger/subscribe.description';

@ApiTags(ApiTagsEnum.Subs)
@Controller(RoutingEnum.subs)
export class SubsController {
  constructor(
    private subsApiService: SubsCudApiService,
    private subsQueryRepo: SubsQueryRepository,
  ) {}

  @GetUserFollowersEndpoint()
  @Get(SubsNavigate.GetFollowers)
  async getUserFollowers(
    @Param('id') userId: string,
  ): Promise<FollowersView[]> {
    return this.subsQueryRepo.getFollowers(userId);
  }

  @GetUserFollowingEndpoint()
  @Get(SubsNavigate.GetFollowing)
  async getUserFollowing(
    @Param('id') userId: string,
  ): Promise<FollowingView[]> {
    return this.subsQueryRepo.getFollowing(userId);
  }

  @Get(SubsNavigate.CountFollow)
  async getUserFollowCounts(
    @Param('id') userId: string,
  ): Promise<ViewSubsCount> {
    return this.subsQueryRepo.getUserFollowCounts(userId);
  }

  @SubscribeDoc()
  @Post(SubsNavigate.Subscribe)
  @UseGuards(AccessTokenGuard)
  async subscribe(
    @CurrentUserId() userId: string,
    @Param('id') followingId: string,
  ): Promise<SubViewModel> {
    const command = new SubscribeCommand({
      followingId,
      followerId: userId,
    });
    return this.subsApiService.create(command);
  }

  @Delete(SubsNavigate.Unsubscribe)
  @UseGuards(AccessTokenGuard)
  async unsubscribe(
    @CurrentUserId() userId: string,
    @Param('id') followingId: string,
  ) {
    const command = new UnsubscribeCommand({
      followingId,
      followerId: userId,
    });
    return this.subsApiService.updateOrDelete(command);
  }
}
