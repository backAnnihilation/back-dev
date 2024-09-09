import { RoutingEnum } from '../../../../../libs/shared/routing';
import { UserNavigate } from '../../../core/routes/user-navigate';

export class ProfileRouting {
  constructor(private readonly baseUrl = RoutingEnum.profiles) {}
  fillOutProfile = () => `${this.baseUrl}/${UserNavigate.FillOutProfile}`;
  editProfile = () => `${this.baseUrl}/${UserNavigate.EditProfile}`;
  getProfile = () => `${this.baseUrl}/${UserNavigate.GetProfile}`;
  uploadPhoto = () => `${this.baseUrl}/${UserNavigate.UploadPhoto}`;
}
