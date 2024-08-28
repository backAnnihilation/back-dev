import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBasicAuth, ApiResponse } from "@nestjs/swagger";

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

export const BasicAuthApi = () =>
  applyDecorators(
    ApiBasicAuth(), // Декоратор для Basic Auth
    ApiResponse({   // Декоратор для обработки неавторизованного доступа
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized - Basic Auth',
    }),
  );

