import { EVENTS_QUEUE, FILES_SERVICE, QUEUE_NAME, RmqService, TcpService, USERS_QUEUE } from '@app/shared';
import { applyAppSettings } from '@file/core/configuration/app-settings';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqOptions, TcpOptions, Transport } from '@nestjs/microservices';

(async () => {
  const app = await NestFactory.create(AppModule);
  // applyAppSettings(app);
  const PORT = app.get(ConfigService).getOrThrow('PORT');
  const rmqService = app.get(RmqService);
  const tcpService = app.get(TcpService);

  const inheritAppConfig = false;
  app.connectMicroservice<RmqOptions>(rmqService.getOptions(USERS_QUEUE), {
    inheritAppConfig,
  });
  app.connectMicroservice<RmqOptions>(rmqService.getOptions(EVENTS_QUEUE), {
    inheritAppConfig,
  });
  app.connectMicroservice<TcpOptions>(tcpService.connectTcpClient, {
    inheritAppConfig,
  });

  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.log(`App starts to listen port: ${PORT}`);
  });
})();
