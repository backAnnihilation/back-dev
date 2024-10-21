import { RoutingEnum } from '@app/shared';
import { BaseRouting } from './base-api.routing';

export class SecurityRouting extends BaseRouting {
  constructor() {
    super(RoutingEnum.security);
  }
  getUserSessions = () => this.baseUrl;
  removeOtherSessions = () => this.baseUrl;
  removeSession = (deviceId: string) => `${this.baseUrl}/${deviceId}`;
}
