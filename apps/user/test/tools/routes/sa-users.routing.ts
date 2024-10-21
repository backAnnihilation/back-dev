import { RoutingEnum } from '@app/shared';
import { BaseRouting } from './base-api.routing';

export class SAUsersRouting extends BaseRouting {
  constructor() {
    super(RoutingEnum.admins);
  }
  getUsers = () => this.baseUrl;
  createSA = () => this.baseUrl;
  banUnbanRestriction = (userId: string) => `${this.baseUrl}/${userId}/ban`;
  deleteSA = (userId: string) => `${this.baseUrl}/${userId}`;
}
