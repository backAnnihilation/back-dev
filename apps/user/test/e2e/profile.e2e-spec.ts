import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { DatabaseService } from '../../src/core/db/prisma/prisma.service';
import { CaptureGuard } from '../../src/features/auth/infrastructure/guards/validate-capture.guard';
import { EditProfileInputModel } from '../../src/features/profile/api/models/input/edit-profile.model';
import { FillOutProfileInputModel } from '../../src/features/profile/api/models/input/fill-out-profile.model';
import { databaseService, dbCleaner } from '../setupTests.e2e';
import { initSettings } from '../tools/initSettings';
import { UsersTestManager } from '../tools/managers/UsersTestManager';
import { mockedCaptureGuard } from '../tools/mock/capture-guard.mock';
import { ImageNames } from '../tools/models/image-names.enum';
import {
  aDescribe,
  e2eTestNamesEnum,
  skipSettings,
} from '../tools/skipSettings';
import {
  constantsTesting,
  InputConstantsType,
} from '../tools/utils/test-constants';
import { ProfileTestManager } from '../tools/managers/ProfileTestManager';

aDescribe(skipSettings.for(e2eTestNamesEnum.Profile))(
  'UserProfileController',
  () => {
    let app: INestApplication;
    let usersTestManager: UsersTestManager;
    let profileTestManager: ProfileTestManager;
    let dbService: DatabaseService;
    let constants: InputConstantsType;

    beforeAll(async () => {
      const testSettings = await initSettings(
        (moduleBuilder: TestingModuleBuilder) =>
          moduleBuilder
            .overrideGuard(CaptureGuard)
            .useValue(mockedCaptureGuard),
        // .overrideProvider(RmqAdapter)
        // .useValue(RmqAdapterMocked),
      );
      app = testSettings.app;
      profileTestManager = new ProfileTestManager(app, databaseService);
      constants = constantsTesting.inputData;
      usersTestManager = testSettings.usersTestManager;
    });

    afterAll(async () => {
      await app.close();
    });

    it('constant true', () => {
      expect(1).toBe(1);
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
        await profileTestManager.fillOutProfile(
          accessToken,
          profileDto,
          HttpStatus.BAD_REQUEST,
        );
      });
      it(`should fill out profile info; user is older than 13`, async () => {
        const { accessToken, userName } = expect.getState();

        const profileDto = profileTestManager.createInputData({
          userName,
          dateOfBirth: '12.06.2011',
        });

        await profileTestManager.fillOutProfile(accessToken, profileDto);
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

        await profileTestManager.editProfile(accessToken, profileDto);

        const editProfileDto = {
          userName,
          firstName: 'newFirstName',
          lastName: 'newLastName',
          city,
          country,
          about,
        };
        await profileTestManager.editProfile(accessToken, editProfileDto);
      });
      it(`shouldn't update profile; age < 13`, async () => {
        const { accessToken, userName } = expect.getState();
        const profileDto: EditProfileInputModel = {
          userName,
          firstName: 'newFirstName',
          lastName: 'newLastName',
          dateOfBirth: '12.12.2011',
        };
        await profileTestManager.editProfile(
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
        await profileTestManager.editProfile(
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
        await profileTestManager.editProfile(
          accessToken,
          profileDto,
          HttpStatus.BAD_REQUEST,
        );
      });
    });

    describe.skip('profile-photo-upload', () => {
      afterAll(async () => {
        // await dbCleaner();
      });

      beforeAll(async () => {
        const inputData = usersTestManager.createInputData({});
        await usersTestManager.registration(inputData);
        const { accessToken } = await usersTestManager.signIn(inputData);

        const profile = await profileTestManager.fillOutProfile(
          accessToken,
          profileTestManager.createInputData({
            userName: inputData.userName,
            firstName: 'newFirstName',
            lastName: 'newLastName',
            dateOfBirth: '12.06.2011',
          }),
        );

        expect.setState({ accessToken, profile });
      });

      it('mediator', async () => {
        const { accessToken, profile } = expect.getState();
        console.log({ accessToken, profile });
      });

      it('get profile', async () => {
        const { accessToken, profile } = expect.getState();
        await usersTestManager.getProfile(profile.id);
      });

      it.skip(`should upload profile photo`, async () => {
        const { accessToken } = expect.getState();
        const imageDto = await usersTestManager.retrieveImageMeta(
          ImageNames.FRESCO,
        );

        await usersTestManager.uploadPhoto(accessToken, imageDto);
      });
    });

    describe.skip('subs', () => {
      afterAll(async () => {
        // await dbCleaner();
      });

      beforeAll(async () => {
        const inputData = usersTestManager.createInputData({});
        await usersTestManager.registration(inputData);
        const { accessToken } = await usersTestManager.signIn(inputData);

        const profileDto = profileTestManager.createInputData();
        const profile = await profileTestManager.fillOutProfile(
          accessToken,
          profileDto,
        );

        expect.setState({ accessToken, profile });
      });
    });
  },
);
