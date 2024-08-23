import { IsString, Matches } from 'class-validator';
import { emailMatches } from '../../../../../../core/validation/length-constants';

export type PasswordRecoveryType = {
  newPassword: string;
  recoveryCode: string;
};

export type SendRecoveryMsgType = { 
  email: string; 
  recoveryCode: string 
};

export class InputEmailDto {
  /**
   * email of account
   */
  @Matches(emailMatches)
  email: string;
}

export class RecoveryPasswordDto extends InputEmailDto {
  @IsString()
  captureToken: string;
}

export type PasswordsType = {
  passwordHash: string;
  passwordSalt: string;
};

export type UpdatePasswordDto = Pick<PasswordRecoveryType, 'recoveryCode'> &
  PasswordsType;
