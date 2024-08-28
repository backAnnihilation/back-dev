import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BcryptAdapter } from '../../../../../core/adapters/bcrypt.adapter';
import {
  GetErrors,
  LayerNoticeInterceptor,
} from '../../../../../core/utils/notification';
import { UserIdType } from '../../../admin/api/models/outputSA.models.ts/user-models';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { CreateUserCommand } from './commands/create-user.command';
import { UserModelDTO } from '../../../admin/application/dto/create-user.dto';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { EmailNotificationEvent } from './events/email-notification-event';
import { CreateUserExternalCommand } from './commands/create-userexternal.command';

@CommandHandler(CreateUserExternalCommand)
export class CreateUserExternalUseCase implements ICommandHandler<CreateUserExternalCommand> {
  private location = this.constructor.name;
  constructor(
    private usersRepo: UsersRepository,
    private bcryptAdapter: BcryptAdapter,
    private authRepo: AuthRepository,
    private eventBus: EventBus
  ) {}

  async execute(
    command: CreateUserExternalCommand
  ): Promise<any> {

    const { email, userName, password } = command.createDto;
    const notice = new LayerNoticeInterceptor<any>();

    const existedUser = await this.authRepo.findExistedUserByEmailOrName({
      userName,
      email,
    });
    

    console.log("existedUser")
    console.log(existedUser)

     if (existedUser) {
      notice.addData({ userId: existedUser.id });
      return notice;
     }

    // if (existedUser) {
    //   if (existedUser.email === email) {
    //     notice.addError(
    //       `User with email ${email} already exists`,
    //       this.location,
    //       GetErrors.IncorrectModel
    //     );
    //   }
    //   if (existedUser.userName === userName) {
    //     notice.addError(
    //       `User with userName ${userName} already exists`,
    //       this.location,
    //       GetErrors.IncorrectModel
    //     );
    //   }
    //   return notice;
    // }

    const { passwordHash } = await this.bcryptAdapter.createHash(password);

    const isConfirmed = true;
    const userDto = new UserModelDTO(
      userName,
      email,
      passwordHash,
      isConfirmed
    );

    // const unconfirmedUserTheSameEmail =
    //   await this.usersRepo.getUnconfirmedUserByEmailOrName(email, userName);

    // if (unconfirmedUserTheSameEmail) {
    //   await this.usersRepo.deleteUser(unconfirmedUserTheSameEmail.id);
    // }

    const result = await this.usersRepo.save(userDto);

    // const event = new EmailNotificationEvent(email, userDto.confirmationCode);
    // this.eventBus.publish(event);
    notice.addData({ userId: result.id });

    return notice;
  }
}
