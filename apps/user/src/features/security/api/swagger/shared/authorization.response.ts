import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const UnauthorizedViaPasswordApiResponse = () =>
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'If the password or userName is wrong',
  });

export const UnauthorizedViaTokenApiResponse = () =>
  ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token',
  });
