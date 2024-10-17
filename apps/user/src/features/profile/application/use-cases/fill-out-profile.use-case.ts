import { LayerNoticeInterceptor, OutputId } from '@app/shared';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../admin/infrastructure/users.repository';
import { IFillOutProfileCommand } from '../../api/models/input/fill-out-profile.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { UserProfileDTO } from '../dto/create-profile.dto';

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
    const notice = new LayerNoticeInterceptor<null | OutputId>();
    const { userId } = command.profileDto;
    const { userName } = await this.userRepo.getUserById(userId);

    const userProfile = await this.profilesRepo.getByUserId(userId);

    if (userProfile) {
      notice.addError(
        'profile already exists',
        this.location,
        notice.errorCodes.AccessForbidden,
      );
      return notice;
    }

    const profileDto = new UserProfileDTO({
      ...command.profileDto,
      userName,
    });

    const result = await this.profilesRepo.save(profileDto);

    notice.addData({ id: result.id });
    return notice;
  }
}
