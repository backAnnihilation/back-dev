import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { UnauthorizedViaTokenApiResponse } from './shared/authorization.response';

export const GetProfileEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get info about the current user',
      description: 'Get email, login and userId about the current user',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      type: UserProfileResponseDto,
      description: 'Success - User profile retrieved successfully',
    }),
    UnauthorizedViaTokenApiResponse(),
    ApiBearerAuth('accessToken'),
  );

export class UserProfileResponseDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  userName: string;
  @ApiProperty()
  userId: string;
}
