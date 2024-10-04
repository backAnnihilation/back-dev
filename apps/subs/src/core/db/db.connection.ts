import { ConfigService } from '@nestjs/config';
import { COLORS, Environment } from '@app/shared';
import { print } from '@app/utils';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

import { EnvironmentVariables } from '../configuration/configuration';

export const getConnection = async (
  configService: ConfigService<EnvironmentVariables>,
): Promise<MongooseModuleOptions> => {
  const ENV = configService.get('ENV');
  const isTesting = ENV === Environment.TESTING;
  const URL = isTesting
    ? configService.get('DATABASE_LOCAL_URL')
    : configService.get('DATABASE_URL');

  const message = `${COLORS.warning}Connecting to PostgreSQL ${
    isTesting ? 'locally' : 'remote'
  }${COLORS.reset}`;
  print(message);


  const [host, port, username, password, database] = extractDbCredentials(URL);

  const connectionConfig: SequelizeModuleOptions = {
    dialect: 'postgres',
    host,
    port: Number(port),
    username,
    password,
    database,
    autoLoadModels: true,
    synchronize: true,
    retryAttempts: 5,
    retryDelay: 1000,
  };

  return connectionConfig;
};

function extractDbCredentials(
  url: string,
): [string, string, string, string, string] {
  const regex =
    /postgresql:\/\/(?<username>[^:]+):(?<password>[^@]+)@(?<host>[^:]+):(?<port>\d+)\/(?<database>[^\?]+)/;
  const match = url.match(regex);

  if (!match || !match.groups) {
    throw new Error('Invalid DATABASE_URL format');
  }

  const { username, password, host, port, database } = match.groups;
  return [host, port, username, password, database];
}
