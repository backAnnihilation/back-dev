import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

export const GetUserPostsEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get user posts',
      description: 'Get all existing posts of a user by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success - All posts of specified user',
      type: [UserPostViewModel],
    }),
  );

export class UserPostViewModel {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: '1234-abcd-5678-efgh',
  })
  id: string;

  @ApiProperty({
    description: 'Post description',
    example: 'This is a description of the post',
  })
  description: string;

  @ApiProperty({
    description: 'User ID who created the post',
    example: 'abcd-1234-efgh-5678',
  })
  userId: string;

  @ApiProperty({
    description: 'URL of the image associated with the post',
    example: 'https://example.com/image.jpg',
  })
  image: string;
}