import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutputId } from '@app/shared';
import { LayerNoticeInterceptor } from '@app/shared';
import { IEditProfile } from '../../api/models/input/edit-profile.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { EditUserProfileDTO } from '../dto/edit-profile.dto';

export class EditProfileCommand {
  constructor(public profileDto: IEditProfile) {}
}

@CommandHandler(EditProfileCommand)
export class EditProfileUseCase implements ICommandHandler<EditProfileCommand> {
  private location = this.constructor.name;
  constructor(private profilesRepo: ProfilesRepository) {}

  async execute(
    command: EditProfileCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    const notice = new LayerNoticeInterceptor<null | OutputId>();
    const { userId } = command.profileDto;

    const userProfile = await this.profilesRepo.getByUserId(userId);
    if (!userProfile) {
      notice.addError(
        'profile does not exist',
        this.location,
        notice.errorCodes.ValidationError,
      );
      return notice;
    }

    const profileDto = new EditUserProfileDTO({
      ...command.profileDto,
    });

    await this.profilesRepo.update(userProfile.id, profileDto);

    return notice;
  }
}
