import {
  ImageType,
  LayerNoticeInterceptor,
  MediaType,
  OutputId,
  PROFILE_IMAGE,
} from '@app/shared';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transport } from '@nestjs/microservices';
import { UploadProfileImageDto } from '../../api/models/input/upload-file-type.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { UserEntities } from '../../api/models/enum/user-entities.enum';
import { ImageStatus } from '@prisma/client';
import { ResponseProfileImageType } from '../../api/models/output/image-notice-type.model';
import { TransportManager } from '@user/core';

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
    const imagePayload = {
      imageFormat: MediaType.IMAGE,
      imageType: ImageType.MAIN,
      image,
      profileId,
    };
    const transport = Transport.TCP;
    const commandName = PROFILE_IMAGE;

    this.transportManager.sendMessage(transport, commandName, imagePayload);

    this.profilesRepo.saveEntity(UserEntities.ProfileImage, {
      profileId,
    });

    notice.addData({ status: ImageStatus.pending, profileId });
    return notice;
  }
}
