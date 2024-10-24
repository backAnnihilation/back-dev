import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { PrismaService, RmqAdapter, TcpAdapter } from '@user/core';
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

aDescribe(skipSettings.for(e2eTestNamesEnum.Profile))(
  'UserProfilesController',
  () => {
    let app: INestApplication;
    let usersTestManager: UsersTestManager;
    let profilesTestManager: ProfileTestManager;
    let dbService: PrismaService;
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
      constants = constantsTesting.inputData;
      usersTestManager = testSettings.usersTestManager;
      dataSeeder = (options) =>
        initializeTestData(
          () => ({
            usersTestManager,
            profilesTestManager,
          }),
          options,
        );
    });

    afterAll(async () => {
      await app.close();
    });

    describe('profile-testing', () => {
      afterAll(async () => {
        await dbCleaner();
      });

      beforeAll(async () => {
        const inputData = usersTestManager.createInputData({});
        await usersTestManager.registration(inputData);
        const { accessToken } = await usersTestManager.signIn(inputData);

        expect.setState({ accessToken, userName: inputData.userName });
      });

      it(`shouldn't fill out profile; age < 13`, async () => {
        const { accessToken, userName } = expect.getState();
        const profileDto: FillOutProfileInputModel = {
          userName,
          firstName: 'newFirstName',
          lastName: 'newLastName',
          dateOfBirth: '12.12.2011',
        };
        await profilesTestManager.fillOutProfile(
          accessToken,
          profileDto,
          HttpStatus.BAD_REQUEST,
        );
      });
      it(`should fill out profile info; user is older than 13`, async () => {
        const { accessToken, userName } = expect.getState();

        const profileDto = profilesTestManager.createInputData({
          userName,
          dateOfBirth: '12.06.2011',
        });

        await profilesTestManager.fillOutProfile(accessToken, profileDto);
      });

      it(`should update profile`, async () => {
        const { accessToken, userName } = expect.getState();
        const { city, country, about } = constants;

        const profileDto = {
          userName,
          firstName: 'updatedFirstName',
          lastName: 'updatedLastName',
          dateOfBirth: '12.06.2011',
          city,
          country,
          about,
        };

        await profilesTestManager.editProfile(accessToken, profileDto);

        const editProfileDto = {
          userName,
          firstName: 'newFirstName',
          lastName: 'newLastName',
          city,
          country,
          about,
        };
        await profilesTestManager.editProfile(accessToken, editProfileDto);
      });
      it(`shouldn't update profile; age < 13`, async () => {
        const { accessToken, userName } = expect.getState();
        const profileDto: EditProfileInputModel = {
          userName,
          firstName: 'newFirstName',
          lastName: 'newLastName',
          dateOfBirth: '12.12.2011',
        };
        await profilesTestManager.editProfile(
          accessToken,
          profileDto,
          HttpStatus.BAD_REQUEST,
        );
      });
      it(`shouldn't update profile; firstName is incorrect`, async () => {
        const { accessToken, userName } = expect.getState();
        const profileDto: EditProfileInputModel = {
          userName,
          firstName: 'newFirstName#',
          lastName: 'newLastName',
        };
        await profilesTestManager.editProfile(
          accessToken,
          profileDto,
          HttpStatus.BAD_REQUEST,
        );
      });
      it(`shouldn't update profile; lastName is incorrect`, async () => {
        const { accessToken, userName } = expect.getState();
        const profileDto: EditProfileInputModel = {
          userName,
          firstName: 'newFirstName',
          lastName: 'newLastName#',
        };
        await profilesTestManager.editProfile(
          accessToken,
          profileDto,
          HttpStatus.BAD_REQUEST,
        );
      });
    });

    describe('profile-photo-upload', () => {
      afterAll(async () => {
        await dbCleaner();
      });

      beforeAll(async () => {
        const inputData = usersTestManager.createInputData({});
        await usersTestManager.registration(inputData);
        const { accessToken } = await usersTestManager.signIn(inputData);

        const profile = await profilesTestManager.fillOutProfile(
          accessToken,
          profilesTestManager.createInputData({
            userName: inputData.userName,
            firstName: 'newFirstName',
            lastName: 'newLastName',
            dateOfBirth: '12.06.2011',
          }),
        );

        expect.setState({ accessToken, profile });
      });

      it('get profile', async () => {
        const { accessToken, profile } = expect.getState();
        console.log({ accessToken, profile });
        await profilesTestManager.getProfile(profile.id);
      });

      it.skip(`should upload profile photo`, async () => {
        const { accessToken } = expect.getState();

        await profilesTestManager.uploadPhoto(accessToken, ImageNames.FRESCO);
      });
    });

    describe('subs', () => {
      afterAll(async () => {
        await dbCleaner();
      });

      beforeAll(async () => {
        await dataSeeder({ profiles: { quantity: 10 } });
      });

      it(`shouldn't subscribe on yourself`, async () => {
        const { users } = expect.getState();
        await profilesTestManager.subscribe(
          users[0].accessToken,
          users[0].id,
          HttpStatus.BAD_REQUEST,
        );
      });

      it(`should subscribe`, async () => {
        const { users } = expect.getState();
        const sub = await profilesTestManager.subscribe(
          users[0].accessToken,
          users[1].id,
        );
        expect(sub.followingCount).toBe(1);
        expect(sub.followerCount).toBe(0);
      });

      it(`shouldn't subscribe twice`, async () => {
        const { users } = expect.getState();
        await profilesTestManager.subscribe(
          users[0].accessToken,
          users[1].id,
          HttpStatus.BAD_REQUEST,
        );
      });

      it(`should unsubscribe`, async () => {
        const { users } = expect.getState();
        await profilesTestManager.unsubscribe(
          users[0].accessToken,
          users[1].id,
        );
        const { followerCount, followingCount } =
          await profilesTestManager.getUserFollowCounts(users[0].id);
        expect(followerCount && followingCount).toBe(0);
      });
      it(`shouldn't unsubscribe twice`, async () => {
        const { users } = expect.getState();
        await profilesTestManager.unsubscribe(
          users[0].accessToken,
          users[1].id,
          HttpStatus.BAD_REQUEST,
        );
      });

      it('should subscribe after unsubscribe', async () => {
        const { users } = expect.getState();
        const [firstUser, ...otherUsers] = users;

        for (const user of otherUsers) {
          await profilesTestManager.subscribe(user.accessToken, firstUser.id);
        }

        const { followerCount, followingCount } =
          await profilesTestManager.getUserFollowCounts(firstUser.id);
        expect(followerCount).toBe(otherUsers.length);
        expect(followingCount).toBe(0);
      });
      it(`all users should unsubscribe from firstUser`, async () => {
        const { users } = expect.getState();
        const [firstUser, ...otherUsers] = users;

        for (const user of otherUsers) {
          await profilesTestManager.unsubscribe(user.accessToken, firstUser.id);
        }
        const { followerCount } = await profilesTestManager.getUserFollowCounts(
          firstUser.id,
        );
        expect(followerCount).toBe(0);
      });
    });
  },
);
