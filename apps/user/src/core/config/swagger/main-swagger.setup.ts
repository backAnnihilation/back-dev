import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RoutingEnum } from '@app/shared';
import { INestApplication } from '@nestjs/common';

export const mainSwaggerSetup = (app: INestApplication) => {
  const mainConfig = new DocumentBuilder()
    .setTitle('Social media platform')
    .setDescription('OpenAPI documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'accessToken',
        description: 'JWT access token',
      },
      'accessToken',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'refresh-Token',
        in: 'cookie',
        description:
          'JWT refreshToken inside cookie. Must be correct, and must not be expired',
      },
      'refreshToken',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'captchaToken',
        in: 'headers',
        description: 'Google reCAPTCHA validation to prevent bots',
      },
      'captchaToken',
    )
    .build();

  const mainDocument = SwaggerModule.createDocument(app, mainConfig);

  let pathsToRemove = RoutingEnum.admins;
  const appPaths = Object.keys(mainDocument.paths);
  if (appPaths[0].startsWith('/api')) {
    pathsToRemove = `/api/v1${pathsToRemove}` as RoutingEnum;
  }
  const pathsToDelete = appPaths.filter((path) =>
    path.startsWith(pathsToRemove),
  );

  pathsToDelete.forEach((path) => delete mainDocument.paths[path]);

  SwaggerModule.setup('api/v1', app, mainDocument);
};
