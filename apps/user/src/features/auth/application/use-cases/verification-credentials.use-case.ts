import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserIdType } from '../../../admin/api/models/outputSA.models.ts/user-models';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { BcryptAdapter } from '@user/core';
import { LayerNoticeInterceptor } from '@app/shared';
import { VerificationCredentialsCommand } from './commands/verification-credentials.command';

@CommandHandler(VerificationCredentialsCommand)
export class VerificationCredentialsUseCase
  implements ICommandHandler<VerificationCredentialsCommand>
{
  private readonly location: string;
  constructor(
    private authRepo: AuthRepository,
    private bcryptAdapter: BcryptAdapter,
  ) {
    this.location = this.constructor.name;
  }

  async execute(
    command: VerificationCredentialsCommand,
  ): Promise<LayerNoticeInterceptor<UserIdType | null>> {
    const notice = new LayerNoticeInterceptor<UserIdType>();
    const errorCode = notice.errorCodes.UnauthorizedAccess;
    const { email, password } = command.verificationDto;

    const userAccount = await this.authRepo.findUserByEmail(email);

    if (!userAccount) {
      notice.addError(
        `User not registered in the system`,
        this.location,
        errorCode,
      );
      return notice;
    }

    const validPassword = await this.bcryptAdapter.compareAsync(
      password,
      userAccount.passwordHash,
    );

    if (validPassword) {
      notice.addData({ userId: userAccount.id });
    } else {
      notice.addError(
        'User password failed to verify',
        this.location,
        errorCode,
      );
    }

    return notice;
  }
}
