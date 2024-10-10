import { ViewSubsCount } from '../../api/models/output-models/view-sub.model';
import { Injectable } from '@nestjs/common';
import { SubsQueryRepository } from '../../api/subs.query.repository';

@Injectable()
export class SubscriptionService {
  constructor(private readonly subsQueryRepo: SubsQueryRepository) {}

  async getUserFollowersAndFollowingCount(
    userId: string,
  ): Promise<ViewSubsCount> {
    const followersCount = await this.subsQueryRepo.getFollowersCount(userId);
    const followingCount = await this.subsQueryRepo.getFollowingCount(userId);

    return { followersCount, followingCount };
  }
}
