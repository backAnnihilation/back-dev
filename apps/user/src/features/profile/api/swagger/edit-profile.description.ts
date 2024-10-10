import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
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
import { ErrorResponseDto } from './fill-out-profile.description';

export const EditProfileEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Fill out user profile',
      description: 'User has to fill his profile with relevant information',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Profile successfully edited',
    }),
    ApiBody({ required: true, type: EditProfileInputModel }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      type: ErrorResponseDto,
    }),
    UnauthorizedViaTokenApiResponse(),
    ApiBearerAuth('accessToken'),
  );

export class EditProfileInputModel {
  @ApiPropertyOptional({
    description: "User's first name",
    example: 'John',
    minLength: nameInitials.min,
    maxLength: nameInitials.max,
    pattern: nameInitialsMatch.toString(),
    nullable: true,
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: "User's last name",
    example: 'Doe',
    minLength: passwordLength.min,
    maxLength: passwordLength.max,
    pattern: nameInitialsMatch.toString(),
    nullable: true,
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: "User's date of birth in YYYY.MM.DD format",
    example: '1990.01.01',
    type: String,
    format: 'date',
    nullable: true,
  })
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Country of the user',
    example: 'USA',
    minLength: frequentLength.min,
    maxLength: frequentLength.max,
    nullable: true,
  })
  country?: string;

  @ApiPropertyOptional({
    description: "User's gender",
    example: Gender.Male,
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'City of the user',
    example: 'New York',
    minLength: frequentLength.min,
    maxLength: frequentLength.max,
    nullable: true,
  })
  city?: string;

  @ApiPropertyOptional({
    description: 'About the user',
    example: 'A software developer with 10 years of experience...',
    minLength: aboutLength.min,
    maxLength: aboutLength.max,
    nullable: true,
  })
  about?: string;
}
