import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse, ApiSecurity,
} from '@nestjs/swagger';
import { TooManyRequestsApiResponse } from './shared/too-many-requests-api-response';
import { CaptchaHeader } from './shared/capture-using';

export const RegistrationEmailResendingEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Resend confirmation registration email if user exist',
      description:
        'Send a new code to the email to confirm registration if the user exists',
    }),
    ApiBody({ type: EmailBodyDto, required: true }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'If the inputModel has invalid email (for example 222^gmail.com)',
    }),
    TooManyRequestsApiResponse(),
    CaptchaHeader(),
    ApiSecurity('captchaToken'),
  );

class EmailBodyDto {
  @ApiProperty({
    required: true,
    example: 'example@mail.com',
    description: 'Email must be a valid email address',
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  })
  email: string;
}
