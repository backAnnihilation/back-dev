import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { awsConfig, validate } from './configuration';
import { rmqConfig } from '@app/shared';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig, rmqConfig],
      isGlobal: true,
      validate,
      cache: true,
      expandVariables: true,
      envFilePath: 'apps/fileHub/.env',
      // process.env.ENV === Environment.TESTING ? 'apps/fileHub/.env' : '',
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
