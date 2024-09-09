import { IsString } from 'class-validator';
import {
  frequentLength,
  passwordLength,
} from '../../../../../../../../libs/shared/validation/input-constants';
import { iSValidField } from '../../../../../../../../libs/shared/validation/validate-input-fields';

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
