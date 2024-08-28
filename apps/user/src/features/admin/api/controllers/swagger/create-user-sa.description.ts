import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBasicAuth, ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiSecurity } from "@nestjs/swagger";
import { BasicAuthApi, UnauthorizedViaTokenApiResponse } from "./shared/authorization.response";
import { PasswordDescription } from "../../../../auth/api/swagger/shared/password-description";
import { SingUpErrorResponse } from "../../../../auth/api/swagger/shared/error-message-response";

export const CreateSaUserEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create user',
      description:
        'Create new user. Super-admin API',
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
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
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
    pattern: '^[a-zA-Z0-9_-]+$',
  })
  userName: string;
}
