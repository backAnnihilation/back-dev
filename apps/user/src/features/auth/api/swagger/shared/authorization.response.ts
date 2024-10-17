import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBasicAuth, ApiResponse } from '@nestjs/swagger';

export const UnauthorizedViaPasswordApiResponse = () =>
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'If the password or login is wrong',
  });

export const UnauthorizedViaTokenApiResponse = () =>
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token',
  });

export const BasicAuthApi = () =>
  applyDecorators(
    ApiBasicAuth(),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized - Basic Auth',
    }),
  );
