import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiResponse,
  ApiSecurity,
  ApiProperty,
  ApiOperation,
} from '@nestjs/swagger';
import { UnauthorizedViaTokenApiResponse } from '../../../auth/api/swagger/shared/authorization.response';

export class Follower {
  @ApiProperty({ description: 'Unique identifier for the sub.' })
  id: string;

  @ApiProperty({ description: 'ID of the user who is following.' })
  followerId: string;

  @ApiProperty({
    description: 'Date and time when the follow relationship was created.',
    type: String,
  })
  createdAt: string;
}

export const GetUserFollowersEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get user followers',
      description:
        'Returns a list of followers for the specified user by their ID.',
    }),
    ApiResponse({ status: HttpStatus.OK, type: [Follower] }),
    UnauthorizedViaTokenApiResponse,
  );
