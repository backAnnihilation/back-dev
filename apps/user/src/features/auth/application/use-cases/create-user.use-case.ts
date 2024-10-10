import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserIdType } from '../../../admin/api/models/outputSA.models.ts/user-models';
import { UsersRepository } from '../../../admin/infrastructure/users.repository';
import { UserModelDTO } from '../../../admin/application/dto/create-user.dto';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { LayerNoticeInterceptor } from '@app/shared';
import { EmailNotificationEvent } from './events/email-notification-event';
import { CreateUserCommand } from './commands/create-user.command';
import { BcryptAdapter } from '@user/core/adapters';

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  private location = this.constructor.name;
  constructor(
    private usersRepo: UsersRepository,
    private bcryptAdapter: BcryptAdapter,
    private authRepo: AuthRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<LayerNoticeInterceptor<UserIdType> | null> {
    const { email, userName, password } = command.createDto;
    const notice = new LayerNoticeInterceptor<any>();

    const confirmedUser = await this.authRepo.findConfirmedUserByEmailOrName({
      userName,
      email,
    });

    if (confirmedUser) {
      const error = notice.errorCodes.ValidationError;
      if (confirmedUser.email === email) {
        notice.addError(
          `User with email ${email} already confirmed`,
          this.location,
          error,
        );
      }
      if (confirmedUser.userName === userName) {
        notice.addError(
          `User with userName ${userName} already confirmed`,
          this.location,
          error,
        );
      }
      return notice;
    }

    const { passwordHash } = await this.bcryptAdapter.createHash(password);

    const isConfirmed = false;
    const userDto = new UserModelDTO(
      userName,
      email,
      passwordHash,
      isConfirmed,
    );

    const unconfirmedUserTheSameEmail =
      await this.usersRepo.getUnconfirmedUserByEmailOrName(email, userName);

    if (unconfirmedUserTheSameEmail) {
      await this.usersRepo.deleteUser(unconfirmedUserTheSameEmail.id);
    }

    const result = await this.usersRepo.save(userDto);

    const event = new EmailNotificationEvent(email, userDto.confirmationCode);
    this.eventBus.publish(event);
    notice.addData({ userId: result.id });

    return notice;
  }
}
