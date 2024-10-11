import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserIdType } from '../../../admin/api/models/outputSA.models.ts/user-models';
import { UsersRepository } from '../../../admin/infrastructure/users.repository';
import { UserModelDTO } from '../../../admin/application/dto/create-user.dto';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { LayerNoticeInterceptor } from '@app/shared';
import { EmailNotificationEvent } from './events/email-notification-event';
import { CreateUserCommand } from './commands/create-user.command';
import { BcryptAdapter } from '@user/core';
import { UserAccount } from '@prisma/client';

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
    const notice = new LayerNoticeInterceptor<UserIdType>();

    const { passwordHash } = await this.bcryptAdapter.createHash(password);
    const isConfirmed = false;
    const userDto = new UserModelDTO(
      userName,
      email,
      passwordHash,
      isConfirmed,
    );

    const user = await this.authRepo.findUserByEmailOrName({
      email,
      userName,
    });

    if (user) {
      return this.handleExistedUser(user, userDto, notice);
    }

    const newUser = await this.usersRepo.save(userDto);
    notice.addData({ userId: newUser.id });

    const event = new EmailNotificationEvent(email, userDto.confirmationCode);
    this.eventBus.publish(event);

    return notice;
  }

  private async handleExistedUser(
    user: UserAccount,
    userDto: UserModelDTO,
    notice: LayerNoticeInterceptor<UserIdType>,
  ): Promise<LayerNoticeInterceptor<UserIdType>> {
    const { email, userName } = userDto;
    if (user.isConfirmed) {
      const error = notice.errorCodes.ValidationError;
      const message =
        user.email === email
          ? `User with email ${email} already exists`
          : `User with name ${userName} already exists`;
      notice.addError(message, this.location, error);
    } else {
      await this.authRepo.updateUserAccount(user.id, userDto);
    }
    notice.addData({ userId: user.id });
    return notice;
  }
}
