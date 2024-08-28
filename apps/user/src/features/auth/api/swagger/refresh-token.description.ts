import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { AccessTokenResponseDto } from './shared/accessToken-response.dto';
import { UnauthorizedViaTokenApiResponse } from './shared/authorization.response';

export const RefreshTokenEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Generate new pair of access and refresh tokens',
      description:
        'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing) Device LastActiveDate should be overridden by issued Date of new refresh token',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      type: AccessTokenResponseDto,
      description:
        'Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds).',
    }),
    UnauthorizedViaTokenApiResponse(),
    ApiSecurity('refreshToken')
  );
