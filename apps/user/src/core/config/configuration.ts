import { plainToInstance } from 'class-transformer';
import { Environment } from '@app/shared';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
  validateOrReject,
} from 'class-validator';
import { print } from '@app/utils';

export type EnvironmentVariable = { [key: string]: string | undefined };
/**
 * Represents the environment variables for the application.
 */
export class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  BASIC_AUTH_USERNAME: string;

  @IsString()
  BASIC_AUTH_PASSWORD: string;

  @IsString()
  EMAIL_PASSWORD: string;

  @IsString()
  EMAIL_USER: string;

  @IsString()
  EMAIL_SERVICE: string;

  @IsString()
  DATABASE_URL: string;

  @IsOptional()
  DATABASE_URL_FOR_TESTS: string;

  @IsString()
  OAUTH_GITHUB_CLIENT_ID: string;
  @IsString()
  OAUTH_GITHUB_CLIENT_SECRET: string;
  @IsString()
  OAUTH_GITHUB_REDIRECT_URL: string;

  @IsString()
  OAUTH_GOOGLE_CLIENT_ID: string;
  @IsString()
  OAUTH_GOOGLE_CLIENT_SECRET: string;
  @IsString()
  OAUTH_GOOGLE_REDIRECT_URL: string;

  @IsString()
  GOOGLE_CAPTURE_SECRET: string;

  @IsString()
  CAPTURE_SITE_KEY: string;

  @IsString()
  TELEGRAM_BOT_TOKEN: string;

  @IsString()
  RMQ_URL: string;
  @IsOptional()
  RMQ_LOCAL_URL: string;
  @IsString()
  RMQ_FILES_QUEUE: string;
  @IsOptional()
  RMQ_EXCHANGE_NAME: string;
  @IsOptional()
  RMQ_ROUTING_KEY: string;
  @IsOptional()
  RMQ_QUEUE_NAME_EMAIL: string;
  @IsOptional()
  RMQ_EXCHANGE_NAME_EMAIL: string;
  @IsOptional()
  RMQ_ROUTING_KEY_EMAIL: string;

  @IsNumber()
  TCP_PORT: number;
  @IsOptional()
  TCP_HOST: string;

  @IsEnum(Environment)
  ENV: Environment;
}

export const getEnvPaths = (env: Environment) => {
  console.log('getEnvPaths', { env });
  const relativePrefix = './apps/user/';
  const envPaths = ['.env.dev', '.env'];
  if (env === Environment.TESTING) envPaths.unshift('.env.test');
  return envPaths.map((p) => relativePrefix + p);
};

export const shouldIgnoreEnvFiles = (env: Environment) =>
  env !== Environment.TESTING && env !== Environment.DEVELOPMENT;

/**
 * Validates the configuration object against the EnvironmentVariables class.
 * @param config The configuration object to validate.
 * @returns The validated configuration object.
 */
export const validate = async (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const ENV = validatedConfig.ENV;
  print('ENV: ' + ENV);

  try {
    await validateOrReject(validatedConfig, {
      skipMissingProperties: false,
    });
  } catch (error) {
    throw new Error(error);
  }

  return validatedConfig;
};
