import { QUEUE_NAME, RmqService, TcpService } from '@app/shared';
import { applyAppSettings } from '@file/core/configuration/app-settings';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, TcpOptions, Transport } from '@nestjs/microservices';

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
