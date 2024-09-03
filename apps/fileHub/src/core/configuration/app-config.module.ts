import { ConfigModule } from '@nestjs/config';
import { awsConfig, validate } from './configuration';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
      isGlobal: true,
      validate,
      expandVariables: true,
      envFilePath: 'apps/fileHub/.env',
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
