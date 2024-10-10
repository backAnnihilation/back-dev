import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import {
  aboutLength,
  frequentLength,
  nameInitials,
  nameInitialsMatch,
  passwordLength,
} from '@app/shared';
import { UnauthorizedViaTokenApiResponse } from '../../../auth/api/swagger/shared/authorization.response';
import { Gender } from '../models/enum/profile.enums';
import { UserProfileResponseType } from './get-profile.description';

class FillOutProfileInputModel {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    minLength: nameInitials.min,
    maxLength: nameInitials.max,
    pattern: nameInitialsMatch.toString(),
    required: true,
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    minLength: passwordLength.min,
    maxLength: passwordLength.max,
    required: true,
  })
  lastName: string;

  @ApiProperty({
    description: 'Date of birth of the user in YYYY.MM.DD format',
    example: '1990.01.01',
    type: String,
    required: true,
  })
  dateOfBirth: string;

  @ApiPropertyOptional({
    description: 'Country of the user',
    example: 'USA',
    minLength: frequentLength.min,
    maxLength: frequentLength.max,
  })
  country?: string;

  @ApiPropertyOptional({
    description: 'Gender of the user',
    example: Gender.Male,
    enum: Gender,
  })
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'City of the user',
    example: 'New York',
    minLength: frequentLength.min,
    maxLength: frequentLength.max,
  })
  city?: string;

  @ApiPropertyOptional({
    description: 'About the user',
    example: 'A software developer with 10 years of experience...',
    minLength: aboutLength.min,
    maxLength: aboutLength.max,
  })
  about?: string;
}

// const fillOutProfileErrorResponseType = createErrorMessageDto({
//   message: {
//     description: 'Error message',
//     example: 'Invalid lastName',
//     nullable: false,
//   },
//   field: {
//     description: 'Field with error',
//     example: 'firstName',
//     nullable: false,
//   },
// });

// class ErrorResponseDto {
//   @ApiProperty({
//     description: 'If the inputModel has incorrect values',
//     type: () => [fillOutProfileErrorResponseType],
//   })
//   errorsMessages: (typeof fillOutProfileErrorResponseType)[];
// }

class ErrorMessageType {
  @ApiProperty({
    description: 'Error message',
    example: 'Invalid firstName',
    nullable: true,
  })
  message: string;

  @ApiProperty({
    description: 'Field where the error occurred',
    example: 'Invalid lastName',
    nullable: true,
  })
  field: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'If the inputModel has incorrect values',
    type: [ErrorMessageType],
  })
  errorsMessages: ErrorMessageType[];
}

export const FillOutProfileEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Fill out user profile',
      description: 'User has to fill his profile with relevant information',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Profile successfully filled',
      type: UserProfileResponseType,
    }),
    ApiBody({ required: true, type: FillOutProfileInputModel }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      type: ErrorResponseDto,
    }),
    UnauthorizedViaTokenApiResponse(),
    ApiBearerAuth('accessToken'),
  );
