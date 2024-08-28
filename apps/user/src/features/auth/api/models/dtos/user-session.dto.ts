import { Payload } from '../auth-input.models.ts/jwt.types';

export class UserSessionDTO {
  ip: string;
  userAgentInfo: string;
  deviceId: string;
  refreshToken: string;
  rtIssuedAt: Date;
  rtExpirationDate: Date;
  userId: string;

  constructor(
    ipAddress: string,
    userAgentInfo: string,
    userPayload: Payload,
    refreshToken: string,
  ) {
    const { deviceId, exp, iat, userId } = userPayload;
    this.ip = ipAddress;
    this.userAgentInfo = userAgentInfo;
    this.deviceId = deviceId;
    this.userId = userId;
    this.refreshToken = refreshToken;
    this.rtIssuedAt = new Date(iat! * 1000);
    this.rtExpirationDate = new Date(exp! * 1000);
  }
}
