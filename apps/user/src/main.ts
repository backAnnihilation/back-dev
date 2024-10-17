import { EVENTS_QUEUE, RmqService, USERS_QUEUE } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { applyAppSettings } from './core/config/app-settings';
import { EnvironmentVariables } from './core/config/configuration';

(async () => {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const rmqService = app.get(RmqService);

  applyAppSettings(app);

  app.connectMicroservice<RmqOptions>(rmqService.getOptions(USERS_QUEUE));
  app.connectMicroservice<RmqOptions>(rmqService.getOptions(EVENTS_QUEUE));
  await app.startAllMicroservices();

  const PORT = app.get(ConfigService<EnvironmentVariables>).getOrThrow('PORT');

  await app.listen(PORT, () => {
    console.log(`App starts to listen port: ${PORT}`);
  });
})();
