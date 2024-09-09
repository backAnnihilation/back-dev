import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutputId } from '../../../../../../../libs/shared/models/output-id.dto';
import {
  GetErrors,
  LayerNoticeInterceptor,
} from '../../../../../../../libs/shared/notification';
import { IEditProfile } from '../../api/models/input/edit-profile.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { EditUserProfileDTO } from '../dto/edit-profile.dto';
('../../api/models/input-models/fill-profile.model');

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
    let notice = new LayerNoticeInterceptor<null | OutputId>();
    const { userId } = command.profileDto;

    const userProfile = await this.profilesRepo.getByUserId(userId);
    if (!userProfile) {
      notice.addError(
        'profile does not exist',
        this.location,
        GetErrors.IncorrectModel,
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
