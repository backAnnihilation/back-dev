import { swaggerSetup } from './swagger.setup';
import { AppModule } from '../../src/app.module';
import { useContainer } from 'class-validator';
import { pipesSetup } from './pipes.setup';
import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { exceptionFilterSetup } from './exception-filter.setup';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables, Environment } from './configuration';

export const applyAppSettings = (app: INestApplication) => {
  const currentENV = app.get(ConfigService<EnvironmentVariables>).get('ENV');

  app.enableCors();
  pipesSetup(app);
  swaggerSetup(app);
  exceptionFilterSetup(app, currentENV);
  app.use(cookieParser());
  currentENV !== Environment.TESTING && app.setGlobalPrefix('api/v1');
  app.setGlobalPrefix('api/v1')
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
