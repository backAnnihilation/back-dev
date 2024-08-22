import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BcryptAdapter } from '../../../../../core/adapters/bcrypt.adapter';
import { LayerNoticeInterceptor } from '../../../../../core/utils/notification';
import { UserIdType } from '../../../admin/api/models/outputSA.models.ts/user-models';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { CreateUserCommand } from './commands/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepo: UsersRepository,
    private bcryptAdapter: BcryptAdapter,
    private eventBus: EventBus,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<LayerNoticeInterceptor<UserIdType> | null> {
    const { email, userName, password } = command.createDto;

    const notice = new LayerNoticeInterceptor<any>();

    const { passwordSalt, passwordHash } =
      await this.bcryptAdapter.createHash(password);

    const userDto = {
      userName,
      email,
      passwordSalt,
      passwordHash,
      isConfirmed: false,
    };

    notice.addData(userDto);
    // const user = UserAccount.create(userDto);

    // const result = await this.usersRepo.save(user);

    // if (!result) {
    //   notice.addError('Could not create user', 'db', GetErrors.DatabaseFail);
    // } else {
    //   notice.addData({ userId: result.userId });
    // }

    // const event = new EmailNotificationEvent(email, user.confirmation_code);
    // this.eventBus.publish(event);

    return notice;
  }
}
