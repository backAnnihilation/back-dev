import { ConfigModule } from '@nestjs/config';
import { shouldIgnoreEnvFiles, getEnvPaths, validate } from './configuration';
import { Global, Module } from '@nestjs/common';
import { Environment, rmqConfig } from '@app/shared';
const env = process.env.ENV as Environment;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rmqConfig],
      validate,
      cache: false,
      expandVariables: true,
      ignoreEnvFile: shouldIgnoreEnvFiles(env),
      envFilePath: getEnvPaths(env),
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
