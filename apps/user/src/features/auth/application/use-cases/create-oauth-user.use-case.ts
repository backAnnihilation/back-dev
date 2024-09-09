import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { Provider, UserAccount } from '@prisma/client';

import { UserProviderDTO } from '../../../admin/application/dto/create-user.dto';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { CreateSessionCommand } from '../../../security/application/use-cases/commands/create-session.command';
import { JwtTokens } from '../../api/models/auth-input.models.ts/jwt.types';
import {
  IGithubProvider,
  IGoogleProvider,
} from '../../api/models/auth-input.models.ts/provider-user-info';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { EmailNotificationOauthEvent } from './events/email-notification-oauth-event';
import { LayerNoticeInterceptor } from '../../../../../../../libs/shared/notification';

export class CreateOAuthUserCommand {
  constructor(public createDto: IGoogleProvider | IGithubProvider) {}
}

@CommandHandler(CreateOAuthUserCommand)
export class CreateOAuthUserUseCase
  implements ICommandHandler<CreateOAuthUserCommand>
{
  private location = this.constructor.name;
  constructor(
    private usersRepo: UsersRepository,
    private authRepo: AuthRepository,
    private eventBus: EventBus,
    private commandBus: CommandBus,
  ) {}

  async execute(
    command: CreateOAuthUserCommand,
  ): Promise<LayerNoticeInterceptor<JwtTokens>> {
    const { email, ...providerInfo } = command.createDto;
    const notice = new LayerNoticeInterceptor<JwtTokens>();

    const existedUser = await this.authRepo.findUserByEmailOrProviderId(
      email,
      providerInfo.providerId,
    );

    if (existedUser)
      return this.handleExistingUser(existedUser, providerInfo, notice);

    return this.handleNewUser(command, notice);
  }

  private async handleExistingUser(
    user: UserAccount,
    providerInfo: ProviderInfo,
    notice: LayerNoticeInterceptor<JwtTokens>,
  ): Promise<LayerNoticeInterceptor<JwtTokens>> {
    const command = new CreateSessionCommand({ userId: user.id });
    const notification = await this.commandBus.execute(command);
    const { accessToken, refreshToken } = notification.data;
    if (!user.provider) {
      await this.authRepo.addProviderInfoToUser(
        user.id,
        providerInfo.provider,
        providerInfo.providerId,
      );
    }

    notice.addData({ accessToken, refreshToken });
    return notice;
  }

  private async handleNewUser(
    command: CreateOAuthUserCommand,
    notice: LayerNoticeInterceptor<JwtTokens>,
  ): Promise<LayerNoticeInterceptor<JwtTokens>> {
    const userDto = new UserProviderDTO(command);

    const savedUser = await this.usersRepo.save(userDto);
    const notification = await this.commandBus.execute(
      new CreateSessionCommand({ userId: savedUser.id }),
    );
    const { accessToken, refreshToken } = notification.data;
    this.eventBus.publish(
      new EmailNotificationOauthEvent(savedUser.email, savedUser.userName),
    );
    notice.addData({ accessToken, refreshToken });
    return notice;
  }
}

type ProviderInfo = {
  provider: Provider;
  providerId: string;
};
