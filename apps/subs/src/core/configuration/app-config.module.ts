import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { validate } from './configuration';
import { rmqConfig } from '@app/shared';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [rmqConfig],
      isGlobal: true,
      validate,
      cache: true,
      expandVariables: true,
      envFilePath: 'apps/subs/.env',
      // process.env.ENV === Environment.TESTING ? 'apps/subs/.env' : '',
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
