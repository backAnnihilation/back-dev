import { convertTime } from '../../../../core/utils/convert-string-to-date';
import { EditProfileInputModel } from '../../api/models/input/edit-profile.model';

export class EditUserProfileDTO {
  readonly birthDate: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly country: string;
  readonly city: string;
  readonly about: string;
  readonly gender: string;

  constructor(profileDto: EditProfileInputModel) {
    const { about, dateOfBirth, firstName, lastName, city, country, gender } =
      profileDto;

    this.birthDate = dateOfBirth && convertTime(dateOfBirth);
    this.lastName = lastName;
    this.firstName = firstName;
    this.about = about;
    this.city = city;
    this.gender = gender;
    this.country = country;
  }
}
