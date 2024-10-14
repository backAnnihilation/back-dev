import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiResponse,
  ApiSecurity,
  ApiProperty,
  ApiOperation,
} from '@nestjs/swagger';
import { UnauthorizedViaTokenApiResponse } from '../../../auth/api/swagger/shared/authorization.response';

export class Following {
  @ApiProperty({ description: 'Unique identifier for the sub.' })
  id: string;

  @ApiProperty({ description: 'ID of the user we subscribe to.' })
  followingId: string;

  @ApiProperty({
    description: 'Date and time when the follow relationship was created.',
    type: String,
  })
  createdAt: string;
}

export const GetUserFollowingEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get user followings',
      description:
        'Returns a list of followings for the specified user by their ID.',
    }),
    ApiResponse({ status: HttpStatus.OK, type: [Following] }),
    UnauthorizedViaTokenApiResponse,
  );
