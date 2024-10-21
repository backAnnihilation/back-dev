import { LayerNoticeInterceptor, validationErrorsMapper } from '@app/shared';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ValidationError, validateOrReject } from 'class-validator';
import { Strategy } from 'passport-local';
import { UserIdType } from '../../../../admin/api/models/outputSA.models.ts/user-models';
import { UserCredentialsDto } from '../../../api/models/auth-input.models.ts/verify-credentials.model';
import { VerificationCredentialsCommand } from '../../../application/use-cases/commands/verification-credentials.command';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private commandBus: CommandBus) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserIdType> {
    await this.validateInputModel(email, password);

    const command = new VerificationCredentialsCommand({
      email,
      password,
    });

    const resultNotice = await this.commandBus.execute<
      VerificationCredentialsCommand,
      LayerNoticeInterceptor<UserIdType | null>
    >(command);

    if (resultNotice.hasError) throw resultNotice.generateErrorResponse;
    return resultNotice.data;
  }

  private async validateInputModel(email: string, password: string) {
    const validation = new UserCredentialsDto();
    validation.email = email;
    validation.password = password;
    try {
      await validateOrReject(validation);
    } catch (errors) {
      await this.handleValidationErrors(errors);
    }
  }

  private async handleValidationErrors(
    errors: ValidationError[],
  ): Promise<void> {
    const errorResponse =
      validationErrorsMapper.mapErrorToValidationPipeError(errors);
    throw new BadRequestException(errorResponse);
  }
}
