import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@shared/environment.enum';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../../app.module';
import { exceptionFilterSetup } from './exception-filter.setup';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swagger/swagger.setup';

export const applyAppSettings = (app: INestApplication) => {
  const currentENV = app.get(ConfigService).get('ENV');

  let appPrefix = 'api/v1';
  currentENV === Environment.TESTING && (appPrefix = '');
  app.setGlobalPrefix(appPrefix);

  const corsSetup = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };
  app.enableCors(corsSetup);
  pipesSetup(app);
  swaggerSetup(app);
  exceptionFilterSetup(app, currentENV);
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
