import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ValidationError, validateOrReject } from 'class-validator';
import { Strategy } from 'passport-local';
import { UserIdType } from '../../../../admin/api/models/outputSA.models.ts/user-models';
import { CommandBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { VerificationCredentialsCommand } from '../../../application/use-cases/commands/verification-credentials.command';
import { UserCredentialsDto } from '../../../api/models/auth-input.models.ts/verify-credentials.model';
import { LayerNoticeInterceptor } from '../../../../../../core/utils/notification';

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

    const result = await this.commandBus.execute<
      VerificationCredentialsCommand,
      LayerNoticeInterceptor<UserIdType | null>
    >(command);

    if (result.hasError)
      throw new UnauthorizedException(result.extensions[0].message);

    return result.data;
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
    const errorResponse: any = {
      message: [],
    };

    for (const error of errors) {
      const constraints = Object.values(error.constraints || {});

      for (const constraint of constraints) {
        errorResponse.message.push({
          field: error.property,
          message: constraint.trim(),
        });
      }
    }
    throw new BadRequestException(errorResponse);
  }
}
