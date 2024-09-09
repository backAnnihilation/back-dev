import { IsOptional, IsString, Matches } from 'class-validator';
import { emailMatches } from '../../../../../../../../libs/shared/validation/input-constants';

export type PasswordRecoveryType = {
  newPassword: string;
  recoveryCode: string;
};

export type SendRecoveryMsgType = {
  email: string;
  recoveryCode: string;
};

export class InputEmailDto {
  /**
   * email of account
   */
  @Matches(emailMatches)
  email: string;
}

export class RecoveryPasswordDto extends InputEmailDto {
  @IsOptional()
  @IsString()
  captureToken?: string;
}

export type PasswordsType = {
  passwordHash: string;
  passwordSalt: string;
};

export type UpdatePasswordDto = {
  userId: string;
  passwordHash: string;
};
