import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { handleErrors } from '../../../../core/utils/handle-response-errors';
import { LayerNoticeInterceptor } from '../../../../core/utils/notification';
import { CreateSessionCommand } from '../../security/application/use-cases/commands/create-session.command';
import { JwtTokens } from '../api/models/auth-input.models.ts/jwt.types';
import { UpdateIssuedTokenCommand } from './use-cases/commands/update-Issued-token.command';
import { ConfirmEmailCommand } from './use-cases/commands/confirm-email.command';
import { UpdateConfirmationCodeCommand } from './use-cases/commands/update-confirmation-code.command';
import { DeleteActiveSessionCommand } from '../../security/application/use-cases/commands/delete-active-session.command';
import { PasswordRecoveryCommand } from './use-cases/commands/password-recovery.command';
import { UpdatePasswordCommand } from './use-cases/commands/update-password.command';
import { CreateUserCommand } from './use-cases/commands/create-user.command';
import { CreateUserExternalCommand } from './use-cases/commands/create-userexternal.command';

export class BaseAuthenticationApiService<TCommand, TResponse> {
  constructor(private readonly commandBus: CommandBus) {}
  async authOperation(command: TCommand): Promise<TResponse> {
    const notification = await this.commandBus.execute<
      TCommand,
      LayerNoticeInterceptor<TResponse>
    >(command);

    if (notification.hasError) {
      const { error } = handleErrors(
        notification.code,
        notification.extensions[0]
      );
      throw error;
    }

    return notification.data;
  }
}

@Injectable()
export class AuthenticationApiService extends BaseAuthenticationApiService<
  | CreateSessionCommand
  | UpdateIssuedTokenCommand
  | ConfirmEmailCommand
  | UpdateConfirmationCodeCommand
  | DeleteActiveSessionCommand
  | PasswordRecoveryCommand
  | UpdatePasswordCommand
  | CreateUserExternalCommand,
  | CreateUserCommand,
  JwtTokens
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
