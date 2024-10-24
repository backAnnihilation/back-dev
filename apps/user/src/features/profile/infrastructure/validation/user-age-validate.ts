import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const isValidAge =
  (minAge = 13, validationOptions?: ValidationOptions) =>
  (object: Object, propertyName: string) =>
    registerDecorator({
      name: 'isValidAge',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [day, month, year] = value.split('.').map(Number);

          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return false;
          }

          const birthDate = new Date(year, month - 1, day);

          if (
            birthDate.getFullYear() !== year ||
            birthDate.getMonth() !== month - 1 ||
            birthDate.getDate() !== day
          ) {
            return false;
          }

          const today = new Date();

          let age = today.getFullYear() - birthDate.getFullYear();

          const monthDifference = today.getMonth() - birthDate.getMonth();

          const isPassedMonthOfBirthday = monthDifference > 0;
          const isPassedDayOfBirthday =
            monthDifference === 0 && today.getDate() >= birthDate.getDate();

          const isBirthdayPassedThisYear =
            isPassedMonthOfBirthday || isPassedDayOfBirthday;

          if (!isBirthdayPassedThisYear) age--;

          return age >= minAge;
        },
        defaultMessage(args: ValidationArguments) {
          return `Age must be at least ${minAge} years old`;
        },
      },
    });
