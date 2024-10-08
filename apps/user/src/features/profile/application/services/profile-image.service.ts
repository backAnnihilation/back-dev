import { SchedulerService } from '@app/shared';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';

export class ProfileImageService extends SchedulerService {
  private readonly jobName = 'profile-image';
  constructor(
    scheduler: SchedulerRegistry,
    private profileRepo: ProfilesRepository,
  ) {
    super(scheduler);
  }

  private async processFailedProfileImages(profileId: string, jobName: string) {
    try {
      await this.profileRepo.getProfileImage(profileId);
    } finally {
      this.deleteJob(jobName);
    }
  }

  initJob(profileId: string) {
    const cb = this.processFailedProfileImages.bind(
      this,
      profileId,
      this.jobName,
    );
    const time = 30 * 60 * 1000;
    this.addTimeout(this.jobName, time, cb);
  }
}
