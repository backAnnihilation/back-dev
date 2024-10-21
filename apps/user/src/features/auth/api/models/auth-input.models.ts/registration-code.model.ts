import { iSValidField, frequentLength } from '@app/shared';

export class RegistrationCodeDto {
  @iSValidField(frequentLength)
  code: string;
}
