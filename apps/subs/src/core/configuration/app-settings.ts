import { INestApplication, INestMicroservice } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { AppModule } from '../../app.module';
import { exceptionFilterSetup } from './exception-filter.setup';
import { pipesSetup } from './pipes.setup';

export const applyAppSettings = (app: INestApplication | INestMicroservice) => {
  const currentENV = app.get(ConfigService).getOrThrow('ENV');

  // let appPrefix = 'api/v1';
  // currentENV === Environment.TESTING && (appPrefix = '');
  // app.setGlobalPrefix(appPrefix);
  // app.enableCors();
  pipesSetup(app);
  // swaggerSetup(app);
  exceptionFilterSetup(app, currentENV);
  // app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
