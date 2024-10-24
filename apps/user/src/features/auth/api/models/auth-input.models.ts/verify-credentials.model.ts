import { IsString } from 'class-validator';
import { frequentLength, iSValidField, passwordLength } from '@app/shared';

export class UserCredentialsDto {
  /**
   * email of the user account
   */
  @iSValidField(frequentLength)
  email: string;

  /**
   * password of the user account.
   */
  @iSValidField(passwordLength)
  password: string;
}

export class UserCredentialsWithCaptureTokenDto extends UserCredentialsDto {
  @IsString()
  captureToken: string;
}
