import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse, ApiSecurity,
} from '@nestjs/swagger';
import { SingUpErrorResponse } from './shared/error-message-response';
import { PasswordDescription } from './shared/password-description';
import { TooManyRequestsApiResponse } from './shared/too-many-requests-api-response';
import { CaptchaHeader } from './shared/capture-using';

export const GoogleOauthEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Sign-in in the system with google',
      description:
        'Registration/login in the system with google',
    }),
    ApiResponse({ status: HttpStatus.OK, description:'Successfully redirect on google'}),
    TooManyRequestsApiResponse(),
  );
