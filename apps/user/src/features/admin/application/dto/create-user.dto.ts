import { Provider } from '@prisma/client';
import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { CreateOAuthUserCommand } from '../../../auth/application/use-cases/create-oauth-user.use-case';

export class UserModelDTO {
  confirmationCode: string;
  confirmationExpDate: Date;
  isConfirmed: boolean;
  constructor(
    public userName: string,
    public email: string,
    public passwordHash: string,
    isConfirmed = false,
  ) {
    this.confirmationCode = uuidv4();
    this.confirmationExpDate = add(new Date(), {
      hours: 1,
      minutes: 15,
    });
    this.isConfirmed = isConfirmed;
  }
}

export class UserProviderDTO {
  id: string;
  isConfirmed: boolean;
  email: string;
  userName: string;
  provider: Provider;
  providerId: string;
  constructor(command: CreateOAuthUserCommand) {
    const { email, userName, provider, providerId } = command.createDto;

    this.isConfirmed = true;
    this.email = email;
    this.userName = userName;
    this.provider = provider;
    this.providerId = providerId;
  }
}

export class LinkLocalUserWithProviderDTO {
  constructor() {}
}
