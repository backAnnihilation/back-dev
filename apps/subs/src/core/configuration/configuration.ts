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
