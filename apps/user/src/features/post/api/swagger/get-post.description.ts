import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

export const GetUserPostEndpoint = () =>
  applyDecorators(
    ApiParam({
      name: 'id',
      required: true,
      description: `User's post id`,
    }),
    ApiOperation({
      summary: 'Get user post',
      description: 'Get user post by post id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Successful response with user post data',
      type: UserProfileResponseType,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User post with specific id was not found',
    }),
  );

export class UserProfileResponseType {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Date when the user profile was created',
    example: '2023-09-01T12:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Additional information about the user',
    example: 'A software developer with 10 years of experience...',
    nullable: true,
  })
  about?: string | null;
}
