import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

export const DeletePostEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete post',
      description: 'Delete post by id. Requires a valid access token.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'Forbidden - If a user tries to delete a post that he does not own',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Success - Post was successfully deleted',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found - Post was not found',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiBearerAuth('accessToken'),
  );
