import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { RmqAdapter, TcpAdapter } from '../../src/core';
import { PrismaService } from '../../src/core/db/prisma/prisma.service';
import { PostsController } from '../../src/features/post/api/controllers/posts.controller';
import { EditProfileInputModel } from '../../src/features/profile/api/models/input/edit-profile.model';
import { FillOutProfileInputModel } from '../../src/features/profile/api/models/input/fill-out-profile.model';
import { databaseService, dbCleaner } from '../setupTests.e2e';
import { initSettings } from '../tools/initSettings';
import { ProfileTestManager } from '../tools/managers/ProfileTestManager';
import { UsersTestManager } from '../tools/managers/UsersTestManager';
import {
  RmqAdapterMocked,
  TcpAdapterMocked,
} from '../tools/mock/transport-adapters.mock';
import { ImageNames } from '../tools/models/image-names.enum';
import {
  aDescribe,
  e2eTestNamesEnum,
  skipSettings,
} from '../tools/skipSettings';
import {
  initializeTestData,
  PrepareTestOptions,
} from '../tools/utils/seed-setup';
import {
  constantsTesting,
  InputConstantsType,
} from '../tools/utils/test-constants';
import { PostsTestManager } from '../tools/managers/PostsTestManager';

aDescribe(skipSettings.for(e2eTestNamesEnum.Post))(PostsController.name, () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;
  let profilesTestManager: ProfileTestManager;
  let postsTestManager: PostsTestManager;
  let databaseService: PrismaService;
  let constants: InputConstantsType;
  let dataSeeder: (options: PrepareTestOptions) => Promise<void>;

  beforeAll(async () => {
    const testSettings = await initSettings(
      (moduleBuilder: TestingModuleBuilder) =>
        moduleBuilder
          .overrideProvider(RmqAdapter)
          .useValue(RmqAdapterMocked)
          .overrideProvider(TcpAdapter)
          .useValue(TcpAdapterMocked),
    );
    app = testSettings.app;
    profilesTestManager = new ProfileTestManager(app, databaseService);
    postsTestManager = new PostsTestManager(app, databaseService);
    constants = constantsTesting.inputData;
    usersTestManager = testSettings.usersTestManager;

    dataSeeder = (options) =>
      initializeTestData(
        () => ({
          usersTestManager,
          profilesTestManager,
          postsTestManager,
        }),
        options,
      );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('posts-testing', () => {
    afterAll(async () => {
      await dbCleaner();
    });

    // beforeAll(async () => {
    //   await dataSeeder({ posts: { quantity: 2 } });
    // });

    it(`should create post`, async () => {
      const { users } = expect.getState();
      const { description } = postsTestManager.createInputData({});
      const post = await postsTestManager.createPost(
        { description, imageName: ImageNames.FRESCO },
        users[0].accessToken,
      );
    });
  });
});
