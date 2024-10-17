import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';


export const CreatePostEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create new post',
      description:
        'Creates a new post for the specified user. Requires a valid access token.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Form data for creating a new post',
      type: CreatePostFormDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request - The input data is invalid',
      type: ErrorsResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Success - Post was successfully created',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiBearerAuth('accessToken'),
  );

export class CreatePostFormDto {
  @ApiProperty({
    description:
      'The image file to upload for the post. Accepted formats are JPEG and PNG. The maximum allowed file size is 20 MB.',
    type: 'string',
    format: 'binary',
    example: 'Upload a JPEG or PNG image file with a maximum size of 20 MB.',
  })
  image: any;

  @ApiProperty({
    description: 'Description of the post. Maximum length is 500 characters.',
    type: 'string',
  })
  description: string;
}
export class ErrorsMessageDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Invalid  input data',
    nullable: true,
  })
  message: string;

  @ApiProperty({
    description: 'Field where the error occurred',
    example: 'description',
    nullable: true,
  })
  field: string;
}

export class ErrorsResponseDto {
  @ApiProperty({
    description: 'If the inputModel has incorrect values',
    type: [ErrorsMessageDto],
  })
  errorsMessages: ErrorsMessageDto[];
}
