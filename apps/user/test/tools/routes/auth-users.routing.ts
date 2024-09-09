import { RoutingEnum } from '../../../../../libs/shared/routing';

export class AuthUsersRouting {
  constructor(private readonly baseUrl = RoutingEnum.auth) {}
  login = () => `${this.baseUrl}/signin`;
  passwordRecovery = () => `${this.baseUrl}/password-recovery`;
  confirmPassword = () => `${this.baseUrl}/new-password`;
  refreshToken = () => `${this.baseUrl}/refresh-token`;
  registrationConfirmation = () => `${this.baseUrl}/registration-confirmation`;
  registration = () => `${this.baseUrl}/signup`;
  registrationEmailResending = () =>
    `${this.baseUrl}/registration-email-resending`;
  logout = () => `${this.baseUrl}/logout`;
  me = () => `${this.baseUrl}/me`;
}
