import { ConfigService } from '@nestjs/config';
import { COLORS, Environment } from '@app/shared';
import { print } from '@app/utils';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { EnvironmentVariables } from '../configuration/configuration';

export const getConnection = async (
  configService: ConfigService<EnvironmentVariables>,
): Promise<MongooseModuleOptions> => {
  const ENV = configService.get('ENV');
  const isDev = ENV === Environment.TESTING;
  const URL = isDev
    ? configService.get('DATABASE_LOCAL_URL')
    : configService.get('DATABASE_URL');

  const message = `${COLORS.warning}Connecting to MongoDB ${
    isDev ? 'locally' : 'remote'
  }${COLORS.reset}`;
  print(message);

  const connectionConfig = {
    uri: URL,
    retryAttempts: 5,
    retryDelay: 1000,
  };

  return connectionConfig;
};
