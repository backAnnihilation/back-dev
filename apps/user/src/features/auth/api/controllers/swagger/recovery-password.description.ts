import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { TooManyRequestsApiResponse } from './shared/too-many-requests-api-response';

export const PasswordRecoveryEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Password recovery via email confirmation',
      description:
        'Password recovery via email confirmation. Email should be sent with recoveryCode inside',
    }),
    ApiBody({ type: RecoveryPasswordBodyDto, required: true }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Even if current email is not registered (for prevent user`s email detection)',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'If the inputModel has invalid email (for example 222^gmail.com)',
    }),
    TooManyRequestsApiResponse(),
  );

class RecoveryPasswordBodyDto {
  @ApiProperty({
    required: true,
    example: 'example@mail.com',
    description: 'Email must be a valid email address',
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  })
  email: string;
}
