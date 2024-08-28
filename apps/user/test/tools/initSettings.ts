import { ConfigService } from '@nestjs/config';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { applyAppSettings } from '../../core/config/app-settings';
import { EnvironmentVariables } from '../../core/config/configuration';
import { DatabaseService } from '../../core/db/prisma/prisma.service';
import { EmailManager } from '../../core/managers/email-manager';
import { AppModule } from '../../src/app.module';
import { databaseService } from '../setupTests.e2e';
import { UsersTestManager } from './managers/UsersTestManager';
import { EmailManagerMock } from './mock/email-manager.mock';
import { databaseCleanUp } from './utils/cleanUp';

export const initSettings = async (
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void
) => {
  try {
    const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule(
      {
        imports: [AppModule],
      }
    )
      .overrideProvider(DatabaseService)
      .useValue(databaseService)
      .overrideProvider(EmailManager)
      .useClass(EmailManagerMock);

    if (addSettingsToModuleBuilder) {
      addSettingsToModuleBuilder(testingModuleBuilder);
    }

    let testingAppModule = await testingModuleBuilder.compile();
    const app = testingAppModule.createNestApplication();

    const configService = app.get(ConfigService<EnvironmentVariables>);

    const env = configService.get('ENV');

    console.log('in tests ENV: ', { env });

    applyAppSettings(app);

    await app.init();

    // const databaseService = app.get(DatabaseService);
    await databaseCleanUp(databaseService);

    const usersTestManager = new UsersTestManager(app, databaseService);

    const httpServer = app.getHttpServer();

    return {
      app,
      configService,
      httpServer,
      usersTestManager,
      testingAppModule,
      databaseService,
    };
  } catch (error) {
    console.error('initSettings:', error);
  }
};
