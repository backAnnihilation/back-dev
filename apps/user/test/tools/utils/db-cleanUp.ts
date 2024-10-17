import { Prisma } from '@prisma/client';
import { DatabaseService } from '@user/core';

export const databaseCleanUp = async (dbService: DatabaseService) => {
  try {
    const tableNames = Object.values(Prisma.ModelName);
    const truncatedTables = [];
    for (const tableName of tableNames) {
      await dbService.$queryRawUnsafe(
        `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`,
      );
      truncatedTables.push(tableName);
    }

    console.log(`Truncated ${truncatedTables} table`);
  } catch (error) {
    throw new Error(`Database clean up failed: ${error}`);
  }
};
