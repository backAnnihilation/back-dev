import { HttpStatus, INestApplication } from '@nestjs/common';
import { DatabaseService } from '../../core/db/prisma/prisma.service';
import { initSettings } from '../tools/initSettings';
import { UsersTestManager } from '../tools/managers/UsersTestManager';
import {
  aDescribe,
  e2eTestNamesEnum,
  skipSettings,
} from '../tools/skipSettings';
import { dbCleaner, databaseService as dbService } from '../setupTests.e2e';
import { FillOutProfileInputModel } from '../../src/features/user/api/models/input/fill-out-profile.model';
import {
  constantsTesting,
  InputConstantsType,
} from '../tools/utils/test-constants';
import { EditProfileInputModel } from '../../src/features/user/api/models/input/edit-profile.model';

aDescribe(skipSettings.for(e2eTestNamesEnum.Profile))('UserController', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;
  let dbService: DatabaseService;
  let constants: InputConstantsType;

  beforeAll(async () => {
    const testSettings = await initSettings();
    app = testSettings.app;
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
      expect.setState({ accessToken });
    });

    it(`shouldn't fill out profile; age < 13`, async () => {
      const { accessToken } = expect.getState();
      const profileDto: FillOutProfileInputModel = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
        dateOfBirth: '12.12.2011',
      };
      await usersTestManager.fillOutProfile(
        accessToken,
        profileDto,
        HttpStatus.BAD_REQUEST,
      );
    });
    it(`should fill out profile info; user is older than 13`, async () => {
      const { accessToken } = expect.getState();
      const profileDto: FillOutProfileInputModel = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
        dateOfBirth: '12.06.2011',
      };
      await usersTestManager.fillOutProfile(accessToken, profileDto);
    });

    it(`should update profile`, async () => {
      const { accessToken } = expect.getState();
      const { city, country, about } = constants;

      const profileDto: EditProfileInputModel = {
        firstName: 'updatedFirstName',
        lastName: 'updatedLastName',
        dateOfBirth: '12.06.2011',
        city,
        country,
        about,
      };

      await usersTestManager.editProfile(accessToken, profileDto);

      const editProfileDto: EditProfileInputModel = {
        city,
        country,
        about,
      };
      await usersTestManager.editProfile(accessToken, editProfileDto);
    });
    it(`shouldn't update profile; age < 13`, async () => {
      const { accessToken } = expect.getState();
      const profileDto: EditProfileInputModel = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
        dateOfBirth: '12.12.2011',
      };
      await usersTestManager.editProfile(
        accessToken,
        profileDto,
        HttpStatus.BAD_REQUEST,
      );
    });
    it(`shouldn't update profile; firstName is incorrect`, async () => {
      const { accessToken } = expect.getState();
      const profileDto: EditProfileInputModel = {
        firstName: 'newFirstName#',
        lastName: 'newLastName',
      };
      await usersTestManager.editProfile(
        accessToken,
        profileDto,
        HttpStatus.BAD_REQUEST,
      );
    });
    it(`shouldn't update profile; lastName is incorrect`, async () => {
      const { accessToken } = expect.getState();
      const profileDto: EditProfileInputModel = {
        firstName: 'newFirstName',
        lastName: 'newLastName#',
      };
      await usersTestManager.editProfile(
        accessToken,
        profileDto,
        HttpStatus.BAD_REQUEST,
      );
    });
  });
});
