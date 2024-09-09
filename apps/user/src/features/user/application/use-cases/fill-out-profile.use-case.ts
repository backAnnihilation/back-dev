import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutputId } from '../../../../../../../libs/shared/models/output-id.dto';
import {
  GetErrors,
  LayerNoticeInterceptor,
} from '../../../../../../../libs/shared/notification';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { IFillOutProfileCommand } from '../../api/models/input/fill-out-profile.model';
import { UserEntities } from '../../api/models/user-entities.enum';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { UserProfileDTO } from '../dto/create-profile.dto';
('../../api/models/input-models/fill-profile.model');

export class FillOutProfileCommand {
  constructor(public profileDto: IFillOutProfileCommand) {}
}

@CommandHandler(FillOutProfileCommand)
export class FillOutProfileUseCase
  implements ICommandHandler<FillOutProfileCommand>
{
  private location = this.constructor.name;
  constructor(
    private userRepo: UsersRepository,
    private profilesRepo: ProfilesRepository,
  ) {}

  async execute(
    command: FillOutProfileCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    let notice = new LayerNoticeInterceptor<null | OutputId>();
    const { userId } = command.profileDto;
    const { userName } = await this.userRepo.getUserById(userId);

    const userProfile = await this.profilesRepo.getByUserId(userId);
    if (userProfile) {
      notice.addError(
        'profile already exists',
        this.location,
        GetErrors.IncorrectModel,
      );
      return notice;
    }

    const profileDto = new UserProfileDTO({
      ...command.profileDto,
      userName,
    });

    const result = await this.userRepo.saveEntity(
      UserEntities.UserProfile,
      profileDto,
    );

    notice.addData({ id: result.id });
    return notice;
  }
}
