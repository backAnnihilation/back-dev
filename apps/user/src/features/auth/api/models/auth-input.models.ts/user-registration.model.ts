import { IsOptional } from 'class-validator';
import {
  userNameLength,
  stringMatch,
  passwordLength,
  passwordMatch,
  frequentLength,
  emailMatches,
} from '../../../../../../../../libs/shared/validation/input-constants';
import { iSValidField } from '../../../../../../../../libs/shared/validation/validate-input-fields';

export class CreateUserDto {
  /**
   * userName of the registered user account
   */
  @iSValidField(userNameLength, stringMatch)
  userName: string;

  /**
   * password of the registered user account.
   */
  @iSValidField(passwordLength, passwordMatch)
  password: string;

  /**
   * email of the registered user account.
   */
  @iSValidField(frequentLength, emailMatches)
  email: string;

  @IsOptional()
  captureToken?: string;
}
