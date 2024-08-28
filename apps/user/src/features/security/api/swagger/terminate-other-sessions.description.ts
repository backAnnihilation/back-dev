import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { UnauthorizedViaTokenApiResponse } from './shared/authorization.response';

export const TerminateOtherUserSessionsEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Terminate other user sessions',
      description:
        'Terminate all other active sessions except the current one. In cookie must be refreshToken',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
    UnauthorizedViaTokenApiResponse(),
    ApiSecurity('refreshToken'),
  );
