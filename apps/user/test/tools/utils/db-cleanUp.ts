import { DatabaseService } from '../../../src/core/db/prisma/prisma.service';

export const databaseCleanUp = async (dbService: DatabaseService) => {
  await dbService.$transaction([
    dbService.post.deleteMany(),
    dbService.userProfile.deleteMany(),
    dbService.userSession.deleteMany(),
    dbService.userAccount.deleteMany(),
  ]);
};
