import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { validate } from './configuration';
import { Environment, rmqConfig } from '@app/shared';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rmqConfig],
      validate,
      cache: true,
      expandVariables: true,
      envFilePath:
        process.env.ENV === Environment.TESTING ? 'apps/user/.env.testing' : '',
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
