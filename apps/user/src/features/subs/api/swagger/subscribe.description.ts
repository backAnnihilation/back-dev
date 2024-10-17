import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiResponse,
  ApiSecurity,
  ApiProperty,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UnauthorizedViaTokenApiResponse } from '../../../auth/api/swagger/shared/authorization.response';
import { SubStatus } from '@prisma/client';

class FollowerInfo {
  @ApiProperty({ description: 'Profile ID of the follower' })
  profileId: string;

  @ApiProperty({ description: 'Profile name of the follower' })
  profileName: string;

  @ApiProperty({ description: "URL of the follower's profile image" })
  imageUrl: string | null;
}

class FollowingInfo {
  @ApiProperty({ description: 'Profile ID of the followed user' })
  profileId: string;

  @ApiProperty({ description: 'Profile name of the followed user' })
  profileName: string;

  @ApiProperty({ description: "URL of the followed user's profile image" })
  imageUrl: string | null;
}

export class SubViewModel {
  @ApiProperty({ description: 'Subscription ID' })
  id: string;

  @ApiProperty({ description: 'Status of the subscription', enum: SubStatus })
  status: SubStatus;

  @ApiProperty({ description: 'ID of the follower' })
  followerId: string;

  @ApiProperty({ description: 'ID of the followed user' })
  followingId: string;

  @ApiProperty({ description: 'Information about the follower' })
  follower: FollowerInfo;

  @ApiProperty({ description: 'Information about the followed user' })
  following: FollowingInfo;

  @ApiProperty({ description: 'Number of followers' })
  followerCount: number;

  @ApiProperty({ description: 'Number of users being followed' })
  followingCount: number;

  @ApiProperty({ description: 'Creation date of the subscription' })
  createdAt: string;
}

class ErrorMessageDto {
  @ApiProperty({
    description: 'Error message',
    nullable: true,
  })
  message: string;

  @ApiProperty({
    description: 'Field where the error occurred',
    nullable: true,
  })
  field: string;
}

export const SubscribeDoc = () =>
  applyDecorators(
    ApiOkResponse({
      type: SubViewModel,
      description:
        'Returns the updated subscription information for the user after the subscription action.',
      status: HttpStatus.CREATED,
    }),
    ApiOperation({
      summary: 'Subscribe to a User',
      description:
        'Allows a user to subscribe to another user, provided they are not already subscribed or attempting to subscribe to themselves.',
    }),

    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Validation error. You cannot subscribe to yourself. Please select a different user to follow.',
      type: ErrorMessageDto,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Validation error. You are already subscribed to this user. Please check your subscriptions.',
      type: ErrorMessageDto,
    }),
    ApiBearerAuth('accessToken'),
    UnauthorizedViaTokenApiResponse(),
  );
