const { execSync } = require('child_process');
const { join } = require('path');
const env = process.env.ENV || 'DEVELOPMENT';

const migrationName = process.argv[2];

if (!migrationName) {
  throw new Error(`Migration name wasn't provided`);
}

const userDirectory = join(__dirname, '..', '..');

let command = `npx prisma migrate dev --name ${migrationName} --schema=./prisma/schemas`;

if (env === 'DEVELOPMENT') {
  command = `dotenv -e .env.dev -- ${command}`;
}

process.chdir(userDirectory);

execSync(command, { stdio: 'inherit' });
