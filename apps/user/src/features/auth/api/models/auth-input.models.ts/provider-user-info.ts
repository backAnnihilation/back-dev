import { Provider } from '@prisma/client';

interface IBaseUserProvider {
  providerId: string;
  provider: Provider;
}

export interface IGoogleProvider extends IBaseUserProvider {
  email: string;
  userName: string;
  avatar?: string;
}

export interface IGithubProvider extends IBaseUserProvider {
  email?: string;
  userName?: string;
}
