import { UserAccount } from '@prisma/client';
import { UserAccountViewModel } from './auth.output.models';

export const getUserAccountViewModel = (
  user: UserAccount,
): UserAccountViewModel => ({
  accountData: {
    id: user.id,
    userName: user.userName,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  },
  emailConfirmation: {
    confirmationCode: user.confirmationCode,
    expirationDate: user.confirmationExpDate.toISOString(),
    isConfirmed: user.isConfirmed,
  },
});
