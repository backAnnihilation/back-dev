import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

export const GetUserProfileEndpoint = () =>
  applyDecorators(
    ApiParam({
      name: 'id',
      required: true,
      description: `User's profile id`,
    }),
    ApiOperation({
      summary: 'Get user profile',
      description: 'Get user profile by profile id',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Successful response with user profile data',
      type: UserProfileResponseType,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User profile with specific id was not found',
    }),
  );

export class LocationType {
  @ApiProperty({
    description: 'Country of the user',
    example: 'USA',
    nullable: true,
  })
  country: string | null;

  @ApiProperty({
    description: 'City of the user',
    example: 'New York',
    nullable: true,
  })
  city: string | null;
}

export class UserProfileResponseType {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'johnDoe',
  })
  userName: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Birth date of the user in YYYY-MM-DD format',
    example: '1990-01-01',
  })
  birthDate: string;

  @ApiProperty({
    description: 'Date when the user profile was created',
    example: '2023-09-01T12:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Location details of the user',
    type: LocationType,
  })
  location: LocationType;

  @ApiProperty({
    description: 'Additional information about the user',
    example: 'A software developer with 10 years of experience...',
    nullable: true,
  })
  about?: string | null;
}
