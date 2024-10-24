import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { emailMatches, nameInitialsMatch } from '@app/shared';

import { SingUpErrorResponse } from '../../../../auth/api/swagger/shared/error-message-response';
import { PasswordDescription } from '../../../../auth/api/swagger/shared/password-description';
import { BasicAuthApi } from '../../../../auth/api/swagger/shared/authorization.response';

export const CreateSaUserEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create user',
      description: 'Create new user. Super-admin API',
    }),
    ApiBody({ required: true, type: CreateUserDto }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, type: SingUpErrorResponse }),
    BasicAuthApi(),
  );

class CreateUserDto {
  @ApiProperty({
    required: true,
    example: 'example@mail.com',
    format: 'Email must be a valid email address',
    description: 'must be unique',
    pattern: emailMatches.toString(),
  })
  email: string;

  @PasswordDescription()
  password: string;

  @ApiProperty({
    required: true,
    example: 'Batman',
    minLength: 6,
    maxLength: 30,
    description: 'must be unique',
    format:
      'Username should consist of letters, numbers, underscores, or dashes',
    pattern: nameInitialsMatch.toString(),
  })
  userName: string;
}
