import { ApiProperty } from '@nestjs/swagger';

export const PasswordDescription = () =>
  ApiProperty({
    required: true,
    minLength: 6,
    maxLength: 20,
    format:
      'Password should be between 6 and 20 characters and include numbers, letters, and special characters',
    pattern: '^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{6,20}$',
  });
