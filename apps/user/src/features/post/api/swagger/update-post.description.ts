import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

export const UpdatePostEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update post',
      description:
        'Update description field in post by id. Requires a valid access token.',
    }),
    ApiBody({
      description: 'Input data for updating a post',
      type: UpdatePostFormDto,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'Forbidden - If a user tries to update a post that he does not own',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request - The input data is invalid',
      type: ErrorsResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Success - Post was successfully updated',
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

export class UpdatePostFormDto {
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
