import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiSecurity } from "@nestjs/swagger";
import { BasicAuthApi, UnauthorizedViaTokenApiResponse } from "./shared/authorization.response";

export const DeleteSaUserEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete user',
      description:
        'Delete a specific user by id. Super-admin API',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
    ApiResponse({
      status:HttpStatus.NOT_FOUND,
      description:'User with specific id was not found'
    }),
    BasicAuthApi(),
    );
