import { SchedulerService } from '@app/shared';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { ImageStatus } from '@prisma/client';

export class ProfileImageService extends SchedulerService {
  private readonly jobName = 'profile-image';
  constructor(
    scheduler: SchedulerRegistry,
    protected profileRepo: ProfilesRepository,
  ) {
    super(scheduler);
  }

  async processFailedProfileImages(imageId: string) {
    try {
      const profileImage = await this.profileRepo.getProfileImage(imageId);
      if (profileImage.status !== ImageStatus.completed) {
        await this.profileRepo.updateProfileImageStatus(
          imageId,
          ImageStatus.failed,
        );
      }
    } catch (e) {
      console.log({ e });
    } finally {
      this.deleteJob(this.jobName);
    }
  }

  initTimeOutJob(imageId: string) {
    const cb = this.processFailedProfileImages.bind(this, imageId);
    const time = 1 * 60 * 1000;
    this.addTimeout(this.jobName, time, cb);
  }
}
