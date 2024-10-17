import { RoutingEnum } from '@app/shared';
import { BaseRouting } from './base-api.routing';

export class SubsRouting extends BaseRouting {
  constructor() {
    super(RoutingEnum.subs);
  }
  getFollowers = (id: string) => `${this.baseUrl}/followers/${id}`;
  getFollowing = (id: string) => `${this.baseUrl}/following/${id}`;
  getCountFollow = (id: string) => `${this.baseUrl}/count/${id}`;
  subscribe = (id: string) => `${this.baseUrl}/subscribe/${id}`;
  unsubscribe = (id: string) => `${this.baseUrl}/unsubscribe/${id}`;
}
