import { ConfigService } from '@nestjs/config';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { print } from '@app/utils';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/core/config/app-settings';
import { EnvironmentVariables } from '../../src/core/config/configuration';
import { EmailManager } from '../../src/core/managers/email.manager';
import { databaseService } from '../setupTests.e2e';
import { UsersTestManager } from './managers/UsersTestManager';
import { EmailManagerMock } from './mock/email-manager.mock';

export const initSettings = async (
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  try {
    const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule(
      {
        imports: [AppModule],
      },
    )
      .overrideProvider(EmailManager)
      .useClass(EmailManagerMock);

    if (addSettingsToModuleBuilder) {
      addSettingsToModuleBuilder(testingModuleBuilder);
    }

    const testingAppModule = await testingModuleBuilder.compile();
    const app = testingAppModule.createNestApplication();

    const configService = app.get(ConfigService<EnvironmentVariables>);

    const env = configService.get('ENV');

    print(`in tests ENV: ${env}`);

    applyAppSettings(app);

    await app.init();

    const usersTestManager = new UsersTestManager(app, databaseService);

    const httpServer = app.getHttpServer();

    return {
      app,
      configService,
      httpServer,
      usersTestManager,
      testingAppModule,
    };
  } catch (error) {
    console.error('initSettings:', error);
  }
};
