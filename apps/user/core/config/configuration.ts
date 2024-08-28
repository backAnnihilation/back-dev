import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsUrl, validateSync } from 'class-validator';

export enum Environment {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  TESTING = 'TESTING',
}

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

  @IsString()
  DATABASE_URL_FOR_TESTS: string;

  // @IsOptional()
  // @IsString()
  // DATABASE_REMOTE_URL?: string;

  // @IsOptional()
  // @IsString()
  // DATABASE_NAME?: string;

  // @IsOptional()
  // @IsNumber()
  // POSTGRES_PORT?: number;

  // @IsOptional()
  // @IsString()
  // POSTGRES_USER?: string;

  // @IsOptional()
  // @IsString()
  // POSTGRES_PASSWORD?: string;

  // @IsOptional()
  // @IsString()
  // MAIN_DB?: 'postgres' | 'mongodb' | 'mysql';

  // @IsString()
  // AWS_REGION: string;

  // @IsString()
  // AWS_ACCESS_KEY_ID: string;

  // @IsString()
  // AWS_SECRET_ACCESS_KEY: string;

  // @IsString()
  // AWS_ENDPOINT: string;

  // @IsString()
  // AWS_BUCKET_NAME: string;

  // @IsString()
  // REDIS_HOST: string;

  // @IsNumber()
  // REDIS_PORT: number;

  // @IsOptional()
  // @IsString()
  // REDIS_PASSWORD?: string;

  // @IsString()
  // TELEGRAM_TOKEN: string;

  // @IsOptional()
  // @IsString()
  // TG_BOT_FOR_TESTS_TOKEN?: string;

  // @IsString()
  // STRIPE_SUCCESS_URL: string;

  // @IsString()
  // STRIPE_CANCEL_URL: string;

  // @IsString()
  // STRIPE_API_KEY: string;

  // @IsString()
  // STRIPE_SECRET: string;

  // @IsString()
  // STRIPE_WEBHOOK_SECRET: string;

  @IsString()
  GOOGLE_CAPTURE_SECRET: string;

  @IsString()
  CAPTURE_SITE_KEY: string;

  @IsEnum(Environment)
  ENV: Environment;
}

const getConfig = (
  environmentVariables: EnvironmentVariable,
  currentEnvironment: Environment,
) => ({
  port: parseInt(environmentVariables.PORT || '5000'),
  jwtSettings: {
    ACCESS_TOKEN_SECRET: environmentVariables.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: environmentVariables.REFRESH_TOKEN_SECRET,
  },
  basicAuth: {
    USERNAME: environmentVariables.BASIC_AUTH_USERNAME,
    PASSWORD: environmentVariables.BASIC_AUTH_PASSWORD,
  },
  emailSettings: {
    EMAIL_PASSWORD: environmentVariables.EMAIL_PASSWORD,
    EMAIL_USER: environmentVariables.EMAIL_USER,
    EMAIL_SERVICE: environmentVariables.EMAIL_SERVICE,
  },
  pg: {
    url: environmentVariables.DATABASE_URL,
    remoteUrl: environmentVariables.DATABASE_REMOTE_URL,
    database: environmentVariables.DATABASE_NAME,
    studyDbName: environmentVariables.studyDbName,
    port: environmentVariables.POSTGRES_PORT,
    username: environmentVariables.POSTGRES_USER,
    password: environmentVariables.POSTGRES_PASSWORD,
    type: environmentVariables.MAIN_DB as 'postgres' | 'mongodb' | 'mysql',
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  telegram: {
    token: process.env.TELEGRAM_TOKEN,
    botForTestsToken: process.env.TG_BOT_FOR_TESTS_TOKEN,
  },
  stripe: {
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,
    api_key: process.env.STRIPE_API_KEY,
    secret: process.env.STRIPE_SECRET,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  google: {
    capture_secret: process.env.GOOGLE_CAPTURE_SECRET,
    site_key: process.env.CAPTURE_SITE_KEY,
  },
  env: currentEnvironment,
});

export type ConfigurationType = ReturnType<typeof getConfig>;

export type EnvironmentVariable = { [key: string]: string | undefined };
export type EnvironmentTypes = keyof typeof Environment;

export default () => {
  const environmentVariables = process.env;

  console.log('process.env.ENV =', environmentVariables.ENV);
  const currentEnvironment = environmentVariables.ENV as Environment;

  return getConfig(environmentVariables, currentEnvironment);
};

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
