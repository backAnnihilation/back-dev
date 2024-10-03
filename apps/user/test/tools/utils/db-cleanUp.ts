import { DatabaseService } from '@user/core';

export const databaseCleanUp = async (dbService: DatabaseService) => {
  try {
    await dbService.$transaction([
      dbService.profileImage.deleteMany(),
      dbService.userProfile.deleteMany(),
      dbService.userSession.deleteMany(),
      dbService.userAccount.deleteMany(),
    ]);
  } catch (error) {
    throw new Error(`Database clean up failed: ${error}`);
  }
};
