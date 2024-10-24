import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import {
  awsConfig,
  getEnvPaths,
  shouldIgnoreEnvFiles,
  validate,
} from './configuration';
import { Environment, rmqConfig } from '@app/shared';
const env = process.env.ENV as Environment;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig, rmqConfig],
      isGlobal: true,
      validate,
      cache: true,
      expandVariables: true,
      ignoreEnvFile: shouldIgnoreEnvFiles(env),
      envFilePath: getEnvPaths(env),
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
