import { LayerNoticeInterceptor } from '@app/shared';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ImageStatus } from '@prisma/client';
import { ResponseProfileImageType } from '../../api/models/output/image-notice-type.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { ProfileImageDeliveryApprovedEvent } from './events/profile-image-delivery-approved.event';
import { ImageDtoType } from '../../api/models/input/update-profile-image-type.model';

export class CompleteProfileImagesCommand {
  constructor(public profileImagesDto: ImageDtoType) {}
}

@CommandHandler(CompleteProfileImagesCommand)
export class CompleteProfileImagesUseCase
  implements ICommandHandler<CompleteProfileImagesCommand>
{
  private location = this.constructor.name;
  constructor(
    private profilesRepo: ProfilesRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    command: CompleteProfileImagesCommand,
  ): Promise<LayerNoticeInterceptor<ResponseProfileImageType>> {
    const notice = new LayerNoticeInterceptor<ResponseProfileImageType>();
    const {
      payload: { profileId, ...urls },
      eventId,
    } = command.profileImagesDto;

    const imageDto = {
      urls,
      status: ImageStatus.success,
    };
    await this.profilesRepo.updateProfileImage(profileId, imageDto);

    const event = new ProfileImageDeliveryApprovedEvent(eventId);
    await this.eventBus.publish(event);

    notice.addData({ status: ImageStatus.pending, profileId });
    return notice;
  }
}
