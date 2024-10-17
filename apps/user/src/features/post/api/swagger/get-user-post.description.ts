import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

export const GetPostEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get post by id',
      description: 'Get specified post by id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success - Get specified post',
      type: UserPostViewModel,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found - Post was not found',
    }),
  );

class UserPostViewModel {
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
