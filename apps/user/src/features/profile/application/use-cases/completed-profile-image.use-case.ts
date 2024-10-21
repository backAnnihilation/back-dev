import { LayerNoticeInterceptor } from '@app/shared';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ImageStatus } from '@prisma/client';
import { ImageDtoType } from '../../api/models/input/update-profile-image-type.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { ProfileImageDeliveryApprovedEvent } from './events/profile-image-delivery-approved.event';

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
  ): Promise<LayerNoticeInterceptor> {
    const notice = new LayerNoticeInterceptor();
    const {
      payload: { profileId, imageId, ...profileImageDto },
      eventId,
    } = command.profileImagesDto;

    const updatedProfileImageDto = {
      ...profileImageDto,
      status: ImageStatus.completed,
    };

    await this.profilesRepo.updateProfileImage(imageId, updatedProfileImageDto);

    const imageProcessingCompletedEvent = new ProfileImageDeliveryApprovedEvent(
      eventId,
    );
    await this.eventBus.publish(imageProcessingCompletedEvent);

    return notice;
  }
}
