import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TestingModuleBuilder } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { EnvironmentVariables } from '../../core/config/configuration';
import { DatabaseService } from '../../core/db/prisma/prisma.service';
import { EmailManager } from '../../core/managers/email-manager';
import { ErrorField } from '../../core/utils/error-handler';
import { JwtTokens } from '../../src/features/auth/api/models/auth-input.models.ts/jwt.types';
import { AuthService } from '../../src/features/auth/application/auth.service';
import { CaptureGuard } from '../../src/features/auth/infrastructure/guards/validate-capture.guard';
import { databaseService, dbCleaner } from '../setupTests.e2e';
import { initSettings } from '../tools/initSettings';
import { UsersTestManager } from '../tools/managers/UsersTestManager';
import { EmailManagerMock } from '../tools/mock/email-manager.mock';
import {
  aDescribe,
  e2eTestNamesEnum,
  skipSettings,
} from '../tools/skipSettings';
import { wait } from '../tools/utils/delayUtils';
import { constructErrorMessages } from '../tools/utils/make-errors-messages';
import { constantsForDataTesting } from '../tools/utils/test-constants';

const mockedCaptureGuard = {
  canActivate: jest.fn().mockImplementation(() => true),
};

aDescribe(skipSettings.for(e2eTestNamesEnum.AUTH))('AuthController', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;
  let dbService: DatabaseService;
  let emailMockManager: EmailManagerMock;
  let emailManager: EmailManager;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const testSettings = await initSettings(
      (moduleBuilder: TestingModuleBuilder) =>
        moduleBuilder.overrideGuard(CaptureGuard).useValue(mockedCaptureGuard)
    );
    app = testSettings.app;

    emailMockManager = new EmailManagerMock();

    emailManager = app.get(EmailManager);
    authService = app.get(AuthService);
    usersTestManager = testSettings.usersTestManager;
    dbService = testSettings.databaseService;
    jwtService = app.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('constant true', () => {
    expect(1).toBe(1);
  });

  describe('testing login/signIn', () => {
    afterAll(async () => {
      await dbCleaner();
    });
    it(`/auth/login (POST) - shouldn't pass singIn with does'nt exist user's email, expect 401`, async () => {
      const inputData = usersTestManager.createInputData({
        email: 'email@email.com',
      });

      await usersTestManager.signIn(inputData, HttpStatus.UNAUTHORIZED);
    });
    it('/auth/login (POST) - should be logged in', async () => {
      const validSignInData = usersTestManager.createInputData({});

      await usersTestManager.createSA(validSignInData);
      const jwtTokens: JwtTokens =
        await usersTestManager.signIn(validSignInData);
    });
  });
  describe('registration/signup', () => {
    afterAll(async () => {
      await dbCleaner();
    });

    it(`/auth/signup (POST) - should pass registration with unique user data, 204`, async () => {
      const correctInputData = usersTestManager.createInputData({});

      await usersTestManager.registration(correctInputData);

      const sendEmailConfirmationMessageSpy = jest
        .spyOn(emailManager, 'sendEmailConfirmationMessage')
        .mockImplementation(emailMockManager.sendEmailConfirmationMessage);

      expect(sendEmailConfirmationMessageSpy).toHaveBeenCalled();
    });
    it(`/auth/registration (POST) - shouldn't receive error with the same already existed userName or email, because is unconfirmed, 204`, async () => {
      const inputData = usersTestManager.createInputData({});

      await usersTestManager.registration(inputData);
    });

    it(`/auth/registration (POST) - should receive error with the invalid userName or email, 400`, async () => {
      const inputData = usersTestManager.createInputData({
        email: constantsForDataTesting.inputData.INVALID_EMAIL,
      });

      const result = await usersTestManager.registration(
        inputData,
        HttpStatus.BAD_REQUEST
      );

      const error = constructErrorMessages([ErrorField.Email]);
      usersTestManager.checkUserData(result, error);
    });

    it(`/auth/registration (POST) - shouldn't pass registration with bad password (length: 6 - 20), 400`, async () => {
      const invalidInputDataShort = usersTestManager.createInputData({
        password: constantsForDataTesting.inputData.length05,
      });

      const invalidInputDataLong = usersTestManager.createInputData({
        password: constantsForDataTesting.inputData.length21,
      });

      const result1 = await usersTestManager.registration(
        invalidInputDataShort,
        HttpStatus.BAD_REQUEST
      );

      const result2 = await usersTestManager.registration(
        invalidInputDataLong,
        HttpStatus.BAD_REQUEST
      );

      const error = constructErrorMessages([ErrorField.Password]);
      usersTestManager.checkUserData(result1, error);
      usersTestManager.checkUserData(result2, error);
    });

    it(`/auth/registration (POST) - shouldn't pass registration with bad userName (length: 6 - 30), 400`, async () => {
      const invalidInputShortName = usersTestManager.createInputData({
        userName: constantsForDataTesting.inputData.length05,
      });

      const invalidInputLongName = usersTestManager.createInputData({
        userName: constantsForDataTesting.inputData.length31,
      });

      const result1 = await usersTestManager.registration(
        invalidInputShortName,
        HttpStatus.BAD_REQUEST
      );

      const result2 = await usersTestManager.registration(
        invalidInputLongName,
        HttpStatus.BAD_REQUEST
      );

      const error = constructErrorMessages([ErrorField.UserName]);
      usersTestManager.checkUserData(result1, error);
      usersTestManager.checkUserData(result2, error);
    });

    it(`/auth/registration (POST) - shouldn't pass registration with bad fields, 400`, async () => {
      const invalidInputDataShort = usersTestManager.createInputData();

      const result = await usersTestManager.registration(
        invalidInputDataShort,
        HttpStatus.BAD_REQUEST
      );

      const error = constructErrorMessages([
        ErrorField.UserName,
        ErrorField.Password,
        ErrorField.Email,
      ]);
      usersTestManager.checkUserData(result, error);
    });
  });
  describe('registration-email-resending', () => {
    beforeAll(async () => {
      const inputData = usersTestManager.createInputData({});
      const user = await usersTestManager.createSA(inputData);

      expect.setState({ user });
    });

    afterAll(async () => {
      await dbCleaner();
    });

    it(`/auth/registration-email-resending (POST) - shouldn't passed api with invalid email, 400`, async () => {
      const res = await usersTestManager.registrationEmailResending(
        '@',
        HttpStatus.BAD_REQUEST
      );

      const error = constructErrorMessages([ErrorField.Email]);
      usersTestManager.checkUserData(res, error);
    });

    it(`/auth/registration-email-resending (POST) - shouldn't passed api with a non-existent email in the system, 400`, async () => {
      await usersTestManager.registrationEmailResending(
        constantsForDataTesting.inputData.EMAIL,
        HttpStatus.BAD_REQUEST
      );
    });

    it(`/auth/registration-email-resending (POST) - shouldn't send message with confirmation code, user is confirmed, 400 `, async () => {
      const { user } = expect.getState();

      await usersTestManager.registrationEmailResending(
        user.email,
        HttpStatus.BAD_REQUEST
      );
    });

    it(`/auth/registration-email-resending (POST) - should send confirmation code, 204`, async () => {
      const registrationData = usersTestManager.createInputData({
        email: constantsForDataTesting.inputData.EMAIL2,
        userName: constantsForDataTesting.inputData.USER_NAME,
      });

      await usersTestManager.registration(registrationData);

      await usersTestManager.registrationEmailResending(registrationData.email);

      const sendEmailConfirmationMessageSpy = jest
        .spyOn(emailManager, 'sendEmailConfirmationMessage')
        .mockImplementation(emailMockManager.sendEmailConfirmationMessage);

      expect(sendEmailConfirmationMessageSpy).toHaveBeenCalled();

      await wait(3);
      const { accessToken } = await usersTestManager.signIn(registrationData);

      const userProfileInfo = await usersTestManager.me(accessToken);

      const { confirmationCode } = await dbService.userAccount.findUnique({
        where: { id: userProfileInfo.userId },
        select: { confirmationCode: true },
      });
      expect(confirmationCode).toBeTruthy();

      expect.setState({ userProfileInfo, confirmationCode });
    });

    it(`/auth/registration-confirmation (POST) - should'nt accept invalid confirmationCode, 400`, async () => {
      await usersTestManager.registrationConfirmation(
        '',
        HttpStatus.BAD_REQUEST
      );
    });

    it(`/auth/registration-confirmation (POST) - should accept confirmationCode, and confirmed user, 204`, async () => {
      const { userProfileInfo, confirmationCode } = expect.getState();

      const { isConfirmed: beforeConfirmed } =
        await dbService.userAccount.findUnique({
          where: { id: userProfileInfo.userId },
          select: { isConfirmed: true },
        });
      expect(beforeConfirmed).toBeFalsy();

      await usersTestManager.registrationConfirmation(confirmationCode);

      const { isConfirmed: afterConfirmed } =
        await dbService.userAccount.findUnique({
          where: { id: userProfileInfo.userId },
          select: { isConfirmed: true },
        });

      expect(afterConfirmed).toBeTruthy();
    });
    it(`/auth/registration (POST) - should receive error with the same already existed email and userName, 400`, async () => {
      const { userProfileInfo } = expect.getState();
      const inputTheSameEmailData = usersTestManager.createInputData({
        email: userProfileInfo.email,
      });

      const theSameEmailResult = await usersTestManager.registration(
        inputTheSameEmailData,
        HttpStatus.BAD_REQUEST
      );

      const inputTheSameUserName = usersTestManager.createInputData({
        userName: userProfileInfo.userName,
      });

      const theSameUserNameResult = await usersTestManager.registration(
        inputTheSameUserName,
        HttpStatus.BAD_REQUEST
      );
    });
  });
  describe('refresh-token', () => {
    beforeAll(async () => {
      const createdUserData = usersTestManager.createInputData({});
      let admin = await usersTestManager.createSA(createdUserData);

      const { accessToken, refreshToken } =
        await usersTestManager.signIn(admin);

      expect.setState({ accessToken, refreshToken, admin });
    });
    afterAll(async () => {
      await dbCleaner();
    });
    it(`shouldn't update tokens if rt is invalid or expired`, async () => {
      const { admin } = expect.getState();
      await usersTestManager.refreshToken('', HttpStatus.UNAUTHORIZED);
      const config = new ConfigService<EnvironmentVariables>();

      jest.spyOn(authService, 'createTokenPair').mockImplementationOnce(() =>
        Promise.all([
          jwtService.sign(
            { userId: admin.id, deviceId: uuidv4() },
            { secret: config.get('ACCESS_TOKEN_SECRET'), expiresIn: '1s' }
          ),
          jwtService.sign(
            { userId: admin.id, deviceId: uuidv4() },
            { secret: config.get('REFRESH_TOKEN_SECRET'), expiresIn: '1s' }
          ),
        ]).then(([accessToken, refreshToken]) => ({
          accessToken,
          refreshToken,
        }))
      );

      const { accessToken, refreshToken } =
        await usersTestManager.signIn(admin);

      await wait(2);
      await usersTestManager.refreshToken(
        refreshToken,
        HttpStatus.UNAUTHORIZED
      );
      await usersTestManager.me(accessToken, null, HttpStatus.UNAUTHORIZED);
      await usersTestManager.logout(refreshToken, HttpStatus.UNAUTHORIZED);

      expect.setState({ expiredAccessToken: accessToken });
    });
    it(`shouldn't get profile auth/me with oldAccessToken`, async () => {
      const { expiredAccessToken } = expect.getState();

      await usersTestManager.me(
        expiredAccessToken,
        null,
        HttpStatus.UNAUTHORIZED
      );
    });
  });
  describe('password-recovery/confirmPassword', () => {
    beforeAll(async () => {
      const inputData = usersTestManager.createInputData({});
      let admin = await usersTestManager.createSA(inputData);
      expect.setState({ admin });
    });
    afterAll(async () => {
      await dbCleaner();
    });

    it(`shouldn't send password recovery code; cause email isn't registered`, async () => {
      await usersTestManager.passwordRecovery(
        constantsForDataTesting.inputData.EMAIL2,
        HttpStatus.NOT_FOUND
      );
      await usersTestManager.passwordRecovery('', HttpStatus.BAD_REQUEST);
    });
    it(`should send password recovery message with code inside through email message`, async () => {
      const { admin } = expect.getState();

      await usersTestManager.passwordRecovery(admin.email);
      const sendEmailRecoveryMessageSpy = jest
        .spyOn(emailManager, 'sendEmailRecoveryMessage')
        .mockImplementationOnce(emailMockManager.sendEmailRecoveryMessage);

      expect(sendEmailRecoveryMessageSpy).toHaveBeenCalled();

      const recoveryPasswordCode = (
        await databaseService.userAccount.findUnique({
          where: { id: admin.id },
        })
      ).passwordRecoveryCode;
      expect(recoveryPasswordCode).toBeTruthy();

      expect.setState({ recoveryPasswordCode });
    });
    it(`shouldn't confirm password; invalid code, 400`, async () => {
      await usersTestManager.confirmPassword(
        { newPassword: 'newPassword', recoveryCode: '' },
        HttpStatus.BAD_REQUEST
      );
      await usersTestManager.confirmPassword(
        {
          newPassword: 'newPassword',
          recoveryCode: constantsForDataTesting.inputData.validUUID,
        },
        HttpStatus.BAD_REQUEST
      );
    });
    it(`should confirm new password`, async () => {
      const { admin, recoveryPasswordCode } = expect.getState();

      const newPassword = 'newPassword';
      await usersTestManager.confirmPassword({
        newPassword,
        recoveryCode: recoveryPasswordCode,
      });

      await usersTestManager.signIn({
        email: admin.email,
        password: newPassword,
      });
    });
  });
  describe('logout', () => {});
  describe('', () => {});
});
