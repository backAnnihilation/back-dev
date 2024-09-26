import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { Environment } from '@app/shared';
import { registerAs } from '@nestjs/config';

export type AwsConfigType = { aws: ReturnType<typeof awsConfig> };
export const awsConfig = registerAs('aws', () => ({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  publicBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
  privateBucketName: process.env.AWS_PRIVATE_BUCKET_NAME,
  accessPoint: process.env.AWS_ACCESS_POINT,
}));

export enum Storage {
  LOCAL = 'LOCAL',
  S3 = 'S3',
}
// TODO change enums
export class EnvironmentVariables {
  @IsNumber()
  @Min(1000)
  @Max(65535)
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsOptional()
  @IsString()
  DATABASE_LOCAL_URL: string;

  @IsOptional()
  AWS_REGION: string;
  @IsOptional()
  AWS_ACCESS_KEY_ID: string;
  @IsOptional()
  AWS_SECRET_ACCESS_KEY: string;
  @IsOptional()
  AWS_PUBLIC_BUCKET_NAME: string;
  @IsOptional()
  AWS_PRIVATE_BUCKET_NAME: string;
  @IsOptional()
  AWS_ACCESS_POINT: string;

  @IsOptional()
  RMQ_URL: string;
  @IsOptional()
  RMQ_LOCAL_URL: string;
  @IsOptional()
  RMQ_FILES_QUEUE: string;

  @IsNumber()
  TCP_PORT: number;
  @IsOptional()
  TCP_HOST: string;

  @IsOptional()
  API_KEY: string;

  @IsEnum(Storage)
  STORAGE: Storage;

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
