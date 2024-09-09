import { RoutingEnum } from "../../../../../libs/shared/routing";

export class SAUsersRouting {
  constructor(private readonly baseUrl = RoutingEnum.admins) {}
  getUsers = () => this.baseUrl;
  createSA = () => this.baseUrl;
  banUnbanRestriction = (userId: string) => `${this.baseUrl}/${userId}/ban`;
  deleteSA = (userId: string) => `${this.baseUrl}/${userId}`;
}
