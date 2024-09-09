import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { TooManyRequestsApiResponse } from './shared/too-many-requests-api-response';
import { ErrorMessageDto } from './shared/error-message-response';

export const RegistrationConfirmationEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Confirm registration',
      description:
        'Confirm your registration with the code that was sent to your email by registration',
    }),
    ApiBody({ type: RegistrationConfirmationCodeDto, required: true }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        'Email was verified. Account was activated',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'If the confirmation code is incorrect, expired or already been applied',
      type: ErrorMessageDto,
    }),
    TooManyRequestsApiResponse(),
  );

class RegistrationConfirmationCodeDto {
  @ApiProperty({
    description: 'confirmation code',
  })
  code: string;
}
