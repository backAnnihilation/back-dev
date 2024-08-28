import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
  ApiResponse,
  ApiSecurity,
  ApiProperty,
  ApiOperation,
} from "@nestjs/swagger";
import { UnauthorizedViaTokenApiResponse } from "./shared/authorization.response";

export class SecurityViewDeviceModel {
  @ApiProperty({ description: "IP address of the device" })
  ip: string;

  @ApiProperty({ description: "Title of the device" })
  title: string;

  @ApiProperty({ description: "Date when the device was last active" })
  lastActiveDate: string;

  @ApiProperty({ description: "Unique identifier for the device" })
  deviceId: string;
}

export const GetUserActiveSessionsEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: "Get all current user sessions",
      description:
        "Get all current user sessions. In cookie must be refreshToken",
    }),
    ApiResponse({ status: HttpStatus.OK, type: SecurityViewDeviceModel }),
    UnauthorizedViaTokenApiResponse,
    ApiSecurity("refreshToken"),
  );
