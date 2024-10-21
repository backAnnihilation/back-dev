import { UserAccount } from '@prisma/client';

import { SAViewType } from './userAdmin.view-type';

export const getSAViewModel = (user: UserAccount): SAViewType => ({
  id: user.id,
  userName: user.userName,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
  // banInfo: {
  //   isBanned: user.userBan?.isBanned || false,
  //   banDate: user.userBan?.banDate || null,
  //   banReason: user.userBan?.banReason || null,
  // },
});
