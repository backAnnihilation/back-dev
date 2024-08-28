import { IsOptional } from 'class-validator';
import {
  emailMatches,
  frequentLength,
  passwordLength,
  passwordMatch,
  stringMatch,
  userNameLength,
} from '../../../../../../core/validation/length-constants';
import { iSValidField } from '../../../../../../core/validation/validate-input-fields';

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
