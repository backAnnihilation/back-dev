import { EVENTS_QUEUE, RmqService, TcpService, USERS_QUEUE } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, TcpOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

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
