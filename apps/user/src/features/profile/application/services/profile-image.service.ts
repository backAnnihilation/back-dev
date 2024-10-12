import { SchedulerService } from '@app/shared';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { ImageStatus } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileImageService extends SchedulerService {
  private jobName: string = 'profile-job';
  constructor(
    scheduler: SchedulerRegistry,
    protected profilesRepo: ProfilesRepository,
  ) {
    super(scheduler);
  }

  async processFailedProfileImages(imageId: string) {
    try {
      const profileImage = await this.profilesRepo.getProfileImage(imageId);
      console.log(ProfileImageService.name, { profileImage });

      if (profileImage?.status !== ImageStatus?.completed) {
        await this.profilesRepo.updateProfileImageStatus(
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

  initTimeOutJob(imageId: string, time: number) {
    this.jobName = `profile-image-${imageId}`;
    const cb = this.processFailedProfileImages.bind(this, imageId);
    this.addTimeout(this.jobName, time, cb);
  }
}
