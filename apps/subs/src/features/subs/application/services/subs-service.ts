import { ViewSubsCount } from '../../api/models/output-models/view-sub.model';
import { Injectable } from '@nestjs/common';
import { SubsQueryRepo } from '../../api/subs.query.repo';

@Injectable()
export class SubscriptionService {
  constructor(private readonly subsQueryRepo: SubsQueryRepo) {}

  async getUserFollowersAndFollowingCount(
    userId: string,
  ): Promise<ViewSubsCount> {
    const followersCount = await this.subsQueryRepo.getFollowersCount(userId);
    const followingCount = await this.subsQueryRepo.getFollowingCount(userId);

    return { followersCount, followingCount };
  }
}
