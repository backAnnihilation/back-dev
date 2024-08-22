import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { UserCredentialsWithCaptureTokenDto } from "../../models/auth-input.models.ts/verify-credentials.model";
import { AccessTokenResponseDto } from "./shared/accessToken-response.dto";
import { UnauthorizedApiResponse } from "./shared/authorization.response";
import { ErrorResponseDto } from "./shared/error-message-response";
import { TooManyRequestsApiResponse } from "./signIn/signIn.description";

export const ConfirmPasswordRecoveryEndpoint = () =>
    applyDecorators(
      ApiBody({ type: UserCredentialsWithCaptureTokenDto }),
      ApiResponse({ status: HttpStatus.OK, type: AccessTokenResponseDto }),
      ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorResponseDto }),
      UnauthorizedApiResponse(),
      TooManyRequestsApiResponse(),
    );