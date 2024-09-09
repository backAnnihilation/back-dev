import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { applyAppSettings } from '../core/config/app-settings';
import { EnvironmentVariables } from '../core/config/configuration';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const configService = app.get(ConfigService<EnvironmentVariables>);
  const PORT = configService.getOrThrow('PORT');
  applyAppSettings(app);

  await app.listen(PORT, () => {
    console.log(`App starts to listen port: ${PORT}`);
  });
})();
