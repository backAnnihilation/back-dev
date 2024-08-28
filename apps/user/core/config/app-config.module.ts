import { ConfigModule } from '@nestjs/config';
import { validate } from './configuration';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      expandVariables: true,
      envFilePath: 'apps/user/.env',
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
