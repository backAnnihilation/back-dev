// const execSync = require('child_process').execSync;
// const path = require('path');

// const migrationName = process.argv[2];

// if (!migrationName) throw new Error(`Migration name wasn't provided`);

// const userProjectPath = path.join(__dirname, '../../../');
// console.log({ userProjectPath });

// const command = `npx prisma migrate dev --name ${migrationName}`;

// process.chdir(userProjectPath);

// execSync(`npx prisma migrate dev --name ${migrationName}`, {
//   stdio: 'inherit',
//   cmd: userProjectPath,
// });
// console.log(`Migration ${migrationName} created successfully.`);

// execSync(command, { stdio: 'inherit' });
