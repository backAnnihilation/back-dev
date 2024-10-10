import { execSync } from 'child_process';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@app/shared';
import { EnvironmentVariables } from '../src/core/config/configuration';
import { DatabaseService } from '../src/core/db/prisma/prisma.service';
import { databaseCleanUp } from './tools/utils/db-cleanUp';

let databaseService: DatabaseService;
let config: ConfigService<EnvironmentVariables>;
let dbCleaner: () => Promise<void>;
beforeAll(async () => {
  config = new ConfigService();

  const dbUrl = config.get('DATABASE_URL_FOR_TESTS');
  console.log({ dbUrl });

  /**
   * @description if you need to apply migrations
   *
   */
  // const workerDir = join(__dirname, '..');
  // execSync('npx prisma migrate dev', {
  //   env: { DATABASE_URL: dbUrl },
  //   cwd: workerDir,
  // });

  databaseService = new DatabaseService({
    datasources: {
      db: { url: dbUrl },
    },
    log: ['query'],
  });

  dbCleaner = databaseCleanUp.bind(null, databaseService);
  await dbCleaner();
});

afterAll(async () => {
  await databaseService.$disconnect();
});

export { databaseService, dbCleaner };
