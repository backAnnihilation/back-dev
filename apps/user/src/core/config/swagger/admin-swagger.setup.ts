import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RoutingEnum } from '@app/shared';
import { INestApplication } from '@nestjs/common';

export const adminSwaggerSetup = (app: INestApplication) => {
  const adminConfig = new DocumentBuilder()
    .setTitle('Social media platform Admin Panel')
    .setDescription('ADMIN DOC')
    .setVersion('1.0')
    .addBasicAuth()
    .build();

  const adminDocument = SwaggerModule.createDocument(app, adminConfig);

  let pathsToRemoveFromAdmin = [
    RoutingEnum.auth,
    RoutingEnum.security,
    RoutingEnum.profiles,
    RoutingEnum.posts,
  ];

  const appPaths = Object.keys(adminDocument.paths);
  if (appPaths[0].startsWith('/api')) {
    pathsToRemoveFromAdmin = pathsToRemoveFromAdmin.map(
      (path) => `/api/v1${path}`,
    ) as RoutingEnum[];
  }
  const pathsToDeleteFromAppPaths = appPaths.filter((path) =>
    pathsToRemoveFromAdmin.some((pathToRemove) =>
      path.startsWith(pathToRemove),
    ),
  );

  pathsToDeleteFromAppPaths.forEach((path) => delete adminDocument.paths[path]);

  SwaggerModule.setup('api/v1/admin/dashboard', app, adminDocument);
};
