import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiSecurity } from "@nestjs/swagger";
import { UnauthorizedViaTokenApiResponse } from "../../../security/api/swagger/shared/authorization.response";

export const LogoutEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: "Log out of the current device",
      description:
        "Client must send a correct refreshToken in a cookie that will be revoked",
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: "No Content",
    }),
    UnauthorizedViaTokenApiResponse(),
    ApiSecurity("refreshToken"),
  );
