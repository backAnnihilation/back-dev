import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UnauthorizedViaTokenApiResponse } from './shared/authorization.response';

export const LogoutEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Log out of the current device',
      description:
        'In cookie client must send correct refreshToken that will be revoked',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
    UnauthorizedViaTokenApiResponse(),
    ApiBearerAuth('refreshToken'),
  );
