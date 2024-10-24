import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { TooManyRequestsApiResponse } from './shared/too-many-requests-api-response';

export const GithubOauthEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Sign-in in the system with github',
      description: 'Registration/login in the system with github',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Successfully redirect on github',
    }),
    TooManyRequestsApiResponse(),
  );
