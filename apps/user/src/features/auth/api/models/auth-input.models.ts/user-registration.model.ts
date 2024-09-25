import {
  iSValidField,
  userNameLength,
  stringMatch,
  passwordLength,
  passwordMatch,
  frequentLength,
  emailMatches,
  passwordFailedMatchMessage,
} from '@app/shared';

export class CreateUserDto {
  /**
   * userName of the registered user account
   */
  @iSValidField(userNameLength, stringMatch)
  userName: string;

  /**
   * password of the registered user account.
   */
  @iSValidField(passwordLength, passwordMatch, passwordFailedMatchMessage)
  password: string;

  /**
   * email of the registered user account.
   */
  @iSValidField(frequentLength, emailMatches)
  email: string;
}
