import {
  iSValidField,
  userNameLength,
  stringMatch,
  passwordLength,
  frequentLength,
  emailMatches,
} from '@app/shared';

export class CreateUserDto {
  /**
   * user's name
   */
  @iSValidField(userNameLength, stringMatch)
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
