import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiProperty,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { emailMatches, passwordMatch } from '@app/shared';
import { AccessTokenResponseDto } from './shared/accessToken-response.dto';
import { UnauthorizedViaPasswordApiResponse } from './shared/authorization.response';
import { CaptchaHeader, CaptureUsing } from './shared/capture-using';
import { ErrorResponseDto } from './shared/error-message-response';
import { TooManyRequestsApiResponse } from './shared/too-many-requests-api-response';

export const SignInEndpoint = () =>
  applyDecorators(
    ApiBody({ required: true, type: SignInDto }),
    ApiResponse({ status: HttpStatus.OK, type: AccessTokenResponseDto }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorResponseDto }),
    ApiHeader({
      name: 'captchaToken',
      description: 'Google reCAPTCHA token for validating the request',
      required: true,
    }),
    UnauthorizedViaPasswordApiResponse(),
    TooManyRequestsApiResponse(),
    CaptureUsing(),
    CaptchaHeader(),
    ApiSecurity('captchaToken'),
  );

class SignInDto {
  @ApiProperty({
    description: 'User email',
    example: 'example@example.com',
    uniqueItems: true,
    pattern: emailMatches.toString(),
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    uniqueItems: true,
    pattern: passwordMatch.toString(),
  })
  password: string;
}
