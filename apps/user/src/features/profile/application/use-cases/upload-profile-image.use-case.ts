import {
  ImageType,
  LayerNoticeInterceptor,
  MediaType,
  OutputId,
  PROFILE_IMAGE
} from '@app/shared';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transport } from '@nestjs/microservices';
import { TransportManager } from '@user/core/managers/transport.manager';
import { UploadProfileImageDto } from '../../api/models/input/upload-file-type.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';

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
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    const notice = new LayerNoticeInterceptor<OutputId>();
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

    const imagePayload = {
      imageFormat: MediaType.IMAGE,
      imageType: ImageType.MAIN,
      image,
      profileId: profile.id,
    };
    const transport = Transport.TCP;
    const commandName = PROFILE_IMAGE;

    const processedImage = await this.transportManager.sendMessage(
      transport,
      commandName,
      imagePayload,
    );

    return notice;
  }
}
