import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RoutingEnum } from '@app/shared';

export function swaggerSetup(app: INestApplication) {
  const config = new DocumentBuilder()
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
  const document = SwaggerModule.createDocument(app, config);

  const pathsToRemove = [RoutingEnum.admins];

  const pathsToDelete = Object.keys(document.paths).filter((path) =>
    pathsToRemove.some((pathToRemove) => path.startsWith(pathToRemove)),
  );

  pathsToDelete.forEach((path) => delete document.paths[path]);

  SwaggerModule.setup('api/v1', app, document);
}
