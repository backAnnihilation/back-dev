import { RoutingEnum } from "../../../../../libs/shared/routing";

export class SecurityRouting {
  constructor(private readonly baseUrl = RoutingEnum.security) {}
  getUserSessions = () => this.baseUrl;
  removeOtherSessions = () => this.baseUrl;
  removeSession = (deviceId: string) => `${this.baseUrl}/${deviceId}`;
}
