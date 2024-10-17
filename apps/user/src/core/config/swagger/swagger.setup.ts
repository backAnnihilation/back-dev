import { INestApplication } from '@nestjs/common';
import { adminSwaggerSetup } from './admin-swagger.setup';
import { mainSwaggerSetup } from './main-swagger.setup';

export const swaggerSetup = (app: INestApplication) => {
  mainSwaggerSetup(app);
  adminSwaggerSetup(app);
};
