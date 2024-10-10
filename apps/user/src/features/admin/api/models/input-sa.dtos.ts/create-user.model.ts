import {
  loginLength,
  stringMatch,
  passwordLength,
  frequentLength,
  emailMatches,
} from '../../../../../../../../libs/shared/src/validation/input-constants';
import { iSValidField } from '../../../../../../../../libs/shared/src/validation/validate-input-fields';

export class CreateUserDto {
  /**
   * user's login
   */
  @iSValidField(loginLength, stringMatch)
  userName: string;

  /**
   * user's registration password
   */
  @iSValidField(passwordLength)
  password: string;

  /**
   * user's registration email
   */
  @iSValidField(frequentLength, emailMatches)
  email: string;
}
