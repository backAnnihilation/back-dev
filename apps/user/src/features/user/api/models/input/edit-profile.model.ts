import { IsEnum, IsOptional } from 'class-validator';
import {
  aboutLength,
  frequentLength,
  nameInitials,
  nameInitialsMatch,
  passwordLength,
  textMatch,
} from '../../../../../../../../libs/shared/validation/input-constants';
import { iSValidField } from '../../../../../../../../libs/shared/validation/validate-input-fields';
import { IsDateFormat } from '../../../infrastructure/validation/date-format-validate';
import { isValidAge } from '../../../infrastructure/validation/user-age-validate';
import { Gender } from '../enum/profile.enums';

export class EditProfileInputModel {
  @IsOptional()
  @iSValidField(nameInitials, nameInitialsMatch)
  firstName?: string;

  @IsOptional()
  @iSValidField(passwordLength, nameInitialsMatch)
  lastName?: string;

  @IsOptional()
  @IsDateFormat()
  @isValidAge()
  dateOfBirth?: string;

  @IsOptional()
  @iSValidField(frequentLength)
  country?: string;

  @IsOptional()
  @IsEnum(Gender)
  @iSValidField(frequentLength)
  gender?: Gender;

  @IsOptional()
  @iSValidField(frequentLength)
  city?: string;

  @IsOptional()
  @iSValidField(aboutLength, textMatch)
  about?: string;
}

export interface IEditProfile extends EditProfileInputModel {
  userId: string;
}
