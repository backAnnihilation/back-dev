import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { TooManyRequestsApiResponse } from './shared/too-many-requests-api-response';

export const GoogleOauthEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Sign-in in the system with google',
      description: 'Registration/login in the system with google',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Successfully redirect on google',
    }),
    TooManyRequestsApiResponse(),
  );
