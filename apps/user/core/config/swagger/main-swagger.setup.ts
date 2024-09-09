import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RoutingEnum } from '../../../../../libs/shared/routing';
import { INestApplication } from '@nestjs/common';

export const mainSwaggerSetup = (app: INestApplication) => {
  const mainConfig = new DocumentBuilder()
    .setTitle('Incta-team')
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

  const pathsToRemove = [RoutingEnum.admins];
  const pathsToDelete = Object.keys(mainDocument.paths).filter((path) =>
    pathsToRemove.some((pathToRemove) => path.startsWith(pathToRemove)),
  );

  pathsToDelete.forEach((path) => delete mainDocument.paths[path]);

  SwaggerModule.setup('api/v1', app, mainDocument);
};
