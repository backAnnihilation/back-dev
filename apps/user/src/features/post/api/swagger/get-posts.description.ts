import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

export const GetUserPostsEndpoint = () =>
  applyDecorators(
    // ApiParam({
    //   name: 'id',
    //   required: true,
    //   description: `User's profile id`,
    // }),
    ApiOperation({
      summary: 'Get user posts',
      description: 'Get all user posts',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Successful response with user posts data',
      type: UserProfileResponseType,
    }),
  );


export class UserProfileResponseType {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Description of post',
    example: 'My post about some topic',
  })
  descripton: string;

  @ApiProperty({
    description: 'Date when the user post was created',
    example: '2023-09-01T12:00:00Z',
  })
  createdAt: string;
}
