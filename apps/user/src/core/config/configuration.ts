import { plainToInstance } from 'class-transformer';
import { Environment } from '@app/shared';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

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

  @IsOptional()
  OAUTH_GOOGLE_CLIENT_ID: string;
  @IsOptional()
  OAUTH_GOOGLE_CLIENT_SECRET: string;
  @IsString()
  OAUTH_GOOGLE_REDIRECT_URL: string;

  @IsString()
  GOOGLE_CAPTURE_SECRET: string;

  @IsString()
  CAPTURE_SITE_KEY: string;

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

  @IsEnum(Environment)
  ENV: Environment;
}
export type EnvironmentVariable = { [key: string]: string | undefined };

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  console.log({ ENV: validatedConfig.ENV });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
