import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptAdapter } from '../../../../../core/adapters/bcrypt.adapter';
import { LayerNoticeInterceptor } from '../../../../../core/utils/notification';
import { ResponseIdType } from '../../api/models/outputSA.models.ts/user-models';
import { UsersRepository } from '../../infrastructure/users.repo';
import { CreateSACommand } from '../commands/create-sa.command';
import { UserModelDTO } from '../dto/create-user.dto';

@CommandHandler(CreateSACommand)
export class CreateSAUseCase implements ICommandHandler<CreateSACommand> {
  constructor(
    private bcryptAdapter: BcryptAdapter,
    private usersRepo: UsersRepository
  ) {}

  async execute(
    command: CreateSACommand
  ): Promise<LayerNoticeInterceptor<ResponseIdType>> {
    let notice = new LayerNoticeInterceptor<ResponseIdType>();

    const { email, userName, password } = command.createData;

    const { passwordHash } = await this.bcryptAdapter.createHash(password);

    const isConfirmed = true;
    const userDto = new UserModelDTO(
      userName,
      email,
      passwordHash,
      isConfirmed
    );

    const savedUser = await this.usersRepo.save(userDto);

    notice.addData({ id: savedUser.id });
    return notice;
  }
}
