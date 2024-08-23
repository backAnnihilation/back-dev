import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { AccessTokenResponseDto } from './shared/accessToken-response.dto';
import { UnauthorizedViaPasswordApiResponse } from './shared/authorization.response';
import { CaptureUsing } from './shared/capture-using';
import { ErrorResponseDto } from './shared/error-message-response';
import { TooManyRequestsApiResponse } from './shared/too-many-requests-api-response';

export const SignInEndpoint = () =>
  applyDecorators(
    ApiBody({ required: true, type: SignInDto }),
    ApiResponse({ status: HttpStatus.OK, type: AccessTokenResponseDto }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorResponseDto }),
    UnauthorizedViaPasswordApiResponse(),
    TooManyRequestsApiResponse(),
    CaptureUsing(),
  );

class SignInDto {
  @ApiProperty({
    description: 'User email',
    example: 'example@example.com',
    uniqueItems: true,
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    uniqueItems: true,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$',
  })
  password: string;
}
