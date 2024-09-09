import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RoutingEnum } from '../../../../../libs/shared/routing';
import { INestApplication } from '@nestjs/common';

export const adminSwaggerSetup = (app: INestApplication) => {
  const adminConfig = new DocumentBuilder()
    .setTitle('Incta-team Admin')
    .setDescription('Admin OpenAPI documentation')
    .setVersion('1.0')
    .addBasicAuth()
    .build();

  const adminDocument = SwaggerModule.createDocument(app, adminConfig);

  const pathsToRemoveFromAdmin = [RoutingEnum.auth, RoutingEnum.security];
  const pathsToDeleteFromAdmin = Object.keys(adminDocument.paths).filter(
    (path) =>
      pathsToRemoveFromAdmin.some((pathToRemove) =>
        path.startsWith(pathToRemove),
      ),
  );

  pathsToDeleteFromAdmin.forEach((path) => delete adminDocument.paths[path]);

  SwaggerModule.setup('api/v1/super-mega-admin', app, adminDocument);
};
