import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';

import { UnauthorizedViaTokenApiResponse } from '../../../auth/api/swagger/shared/authorization.response';

export const DeleteSessionEndpoint = () =>
  applyDecorators(
    ApiParam({ name: 'id', type: String, description: 'ID of the device' }),
    ApiOperation({
      summary: 'Terminate specific session',
      description:
        'Terminate a specific user session by id. In cookie must be refreshToken',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success - Session was terminated successfully',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Session was not found',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Do not have permission',
    }),
    UnauthorizedViaTokenApiResponse(),
    ApiSecurity('refreshToken'),
  );
