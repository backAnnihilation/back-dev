import {
  aboutLength,
  frequentLength,
  nameInitials,
  nameInitialsMatch,
  userNameLength,
} from '@app/shared';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { UnauthorizedViaTokenApiResponse } from '../../../auth/api/swagger/shared/authorization.response';
import { ErrorResponseDto } from './fill-out-profile.description';

class EditProfileModel {
  @ApiProperty({
    required: true,
    example: 'Batman',
    minLength: userNameLength.min,
    maxLength: userNameLength.max,
    description: 'must be unique',
    format:
      'Username should consist of letters, numbers, underscores, or dashes',
    pattern: '^[a-zA-Z0-9_-]+$',
  })
  userName: string;
  @ApiProperty({
    description: "User's first name",
    example: 'John',
    minLength: nameInitials.min,
    maxLength: nameInitials.max,
    pattern: nameInitialsMatch.toString(),
  })
  firstName?: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
    minLength: nameInitials.min,
    maxLength: nameInitials.max,
    pattern: nameInitialsMatch.toString(),
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Date of birth of the user in mm.dd.yyyy format',
    example: '01.01.1991',
    type: String,
    format: 'date-time',
    pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
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

export const EditProfileEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Edit user profile',
      description: 'User can edit his profile with relevant information',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Profile successfully edited',
    }),
    ApiBody({ required: true, type: EditProfileModel }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      type: ErrorResponseDto,
    }),
    UnauthorizedViaTokenApiResponse(),
    ApiBearerAuth('accessToken'),
  );
