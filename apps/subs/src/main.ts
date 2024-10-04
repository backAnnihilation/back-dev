import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';

import { QUEUE_NAME, RmqService } from '@app/shared';

import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);
  // applyAppSettings(app);
  const PORT = app.get(ConfigService).getOrThrow('PORT');
  const rmqService = app.get(RmqService);

  const inheritAppConfig = true;
  app.connectMicroservice<RmqOptions>(rmqService.getOptions(QUEUE_NAME.FILES), {
    inheritAppConfig,
  });

  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.log(`App starts to listen port: ${PORT}`);
  });
})();
