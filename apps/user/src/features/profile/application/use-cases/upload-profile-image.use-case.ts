import { LayerNoticeInterceptor, PROFILE_IMAGE_UPLOAD } from '@app/shared';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transport } from '@nestjs/microservices';
import { ImageStatus } from '@prisma/client';
import { TransportManager } from '../../../../core/managers/transport.manager';
import { UploadProfileImageDto } from '../../api/models/input/upload-file-type.model';
import { ResponseProfileImageType } from '../../api/models/output/image-notice-type.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { ProfileImageService } from '../services/profile-image.service';

export class UploadProfileImageCommand {
  constructor(public imageDto: UploadProfileImageDto) {}
}

@CommandHandler(UploadProfileImageCommand)
export class UploadProfileImageUseCase
  implements ICommandHandler<UploadProfileImageCommand>
{
  private location = this.constructor.name;
  constructor(
    private profilesRepo: ProfilesRepository,
    private transportManager: TransportManager,
    private profileServiceScheduler: ProfileImageService,
  ) {}

  async execute(
    command: UploadProfileImageCommand,
  ): Promise<LayerNoticeInterceptor<ResponseProfileImageType>> {
    const notice = new LayerNoticeInterceptor<ResponseProfileImageType>();
    const { userId, image } = command.imageDto;

    const profile = await this.profilesRepo.getByUserId(userId);

    if (!profile) {
      notice.addError(
        'profile does not exist',
        this.location,
        notice.errorCodes.ValidationError,
      );
      return notice;
    }
    const profileId = profile.id;

    const profileImage = await this.profilesRepo.saveImage({ profileId });
    const imageId = profileImage.id;

    const payload = {
      image,
      profileId,
      imageId,
    };

    this.transportManager.sendMessage({
      transport: Transport.TCP,
      command: PROFILE_IMAGE_UPLOAD,
      payload,
    });

    // Check if the file won't be completed after 10 seconds and mark the operation as failed.
    this.profileServiceScheduler.initTimeOutJob(imageId, 10000);

    notice.addData({
      status: ImageStatus.pending,
      profileId,
      imageId,
    });
    return notice;
  }
}
