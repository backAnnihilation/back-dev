import {
  frequentLength,
  iSValidField,
  passwordFailedMatchMessage,
  passwordLength,
  passwordMatch,
} from '@app/shared';

export class RecoveryPassDto {
  /**
   * newPassword of the user account
   */
  @iSValidField(passwordLength, passwordMatch, passwordFailedMatchMessage)
  newPassword: string;

  /**
   * recoveryCode of the user account.
   */
  @iSValidField(frequentLength)
  recoveryCode: string;
}
