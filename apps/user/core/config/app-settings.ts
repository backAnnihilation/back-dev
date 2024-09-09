import { swaggerSetup } from './swagger/swagger.setup';
import { AppModule } from '../../src/app.module';
import { useContainer } from 'class-validator';
import { pipesSetup } from './pipes.setup';
import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { exceptionFilterSetup } from './exception-filter.setup';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './configuration';
import { Environment } from '../../../../libs/shared/environment.enum';

export const applyAppSettings = (app: INestApplication) => {
  const currentENV = app.get(ConfigService<EnvironmentVariables>).get('ENV');
  console.log({ currentENV });

  currentENV !== Environment.TESTING && app.setGlobalPrefix('api/v1');
  app.enableCors();
  pipesSetup(app);
  swaggerSetup(app);
  exceptionFilterSetup(app, currentENV);
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
