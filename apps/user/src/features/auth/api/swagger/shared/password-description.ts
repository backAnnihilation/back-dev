import { ApiProperty } from '@nestjs/swagger';
import { passwordMatch } from '@app/shared';

export const PasswordDescription = () =>
  ApiProperty({
    required: true,
    minLength: 6,
    maxLength: 20,
    example: 'Passw0rd!',
    format:
      'Password should be between 6 and 20 characters and include numbers, letters, and special characters',
    pattern: passwordMatch.toString(),
  });
