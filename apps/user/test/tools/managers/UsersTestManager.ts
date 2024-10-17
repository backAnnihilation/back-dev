import { HttpStatus, INestApplication } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as request from 'supertest';
import { DatabaseService } from '../../../src/core';
import { SAViewType } from '../../../src/features/admin/api/models/user.view.models/userAdmin.view-type';
import { JwtTokens } from '../../../src/features/auth/api/models/auth-input.models.ts/jwt.types';
import { RecoveryPassDto } from '../../../src/features/auth/api/models/auth-input.models.ts/recovery.model';
import { UserProfileType } from '../../../src/features/auth/api/models/auth.output.models/auth.output.models';
import {
  AuthUserType,
  AuthUserWithToken,
} from '../../../src/features/auth/api/models/auth.output.models/auth.user.types';
import { SecurityViewDeviceModel } from '../../../src/features/security/api/models/security.view.models/security.view.types';
import { SuperTestBody } from '../models/body.response.model';
import { AuthUsersRouting } from '../routes/auth-users.routing';
import { ProfileRouting } from '../routes/profile-user.routing';
import { SAUsersRouting } from '../routes/sa-users.routing';
import { SecurityRouting } from '../routes/security.routing';
import { BaseTestManager } from './BaseTestManager';

export class UsersTestManager extends BaseTestManager {
  protected readonly routing: AuthUsersRouting;
  protected readonly saRouting: SAUsersRouting;
  protected readonly securityRouting: SecurityRouting;
  protected readonly profileRouting: ProfileRouting;
  protected usersRepo: Prisma.UserAccountDelegate;
  constructor(
    protected readonly app: INestApplication,
    private prisma: DatabaseService,
  ) {
    super(app);
    this.routing = new AuthUsersRouting();
    this.saRouting = new SAUsersRouting();
    this.securityRouting = new SecurityRouting();
    this.profileRouting = new ProfileRouting();
    this.usersRepo = this.prisma.userAccount;
  }

  createInputData(field?: AuthUserType | object): AuthUserType {
    let userData = {
      userName: ' ',
      password: ' ',
      email: ' ',
    };
    if (field) {
      const { USER_NAME, VALID_PASSWORD, EMAIL } = this.constants;
      const { userName, password, email } = field as AuthUserType;
      userData = {
        userName: userName || USER_NAME,
        password: password || VALID_PASSWORD,
        email: email || EMAIL,
      };
    }
    return userData;
  }

  expectCorrectModel(createModel: any, responseModel: any) {
    expect(createModel.name).toBe(responseModel.name);
    expect(createModel.email).toBe(responseModel.email);
  }

  async createSA(
    inputData: AuthUserType,
    expectedStatus = HttpStatus.CREATED,
  ): Promise<AuthUserType> {
    const { basicUser, basicPass, authBasic } = this.authConstants;
    let admin: AuthUserType;
    await request(this.application)
      .post(this.saRouting.createSA())
      .auth(basicUser, basicPass, authBasic)
      .send(inputData)
      .expect(({ body }: SuperTestBody<SAViewType>) => {
        admin = body;
        admin.password = inputData.password;
      })
      .expect(expectedStatus);

    return admin;
  }

  async createUsers(
    numberOfUsers = 3,
  ): Promise<{ users: AuthUserWithToken[]; accessTokens: string[] }> {
    const { USER_NAMES } = this.constants;

    const users: AuthUserWithToken[] = [];
    const accessTokens: string[] = [];

    for (let i = 0; i < numberOfUsers; i++) {
      const userData = {
        userName: USER_NAMES[i] || `userName${i}`,
        email: `email${i}@test.test`,
      };

      const userInputData = this.createInputData(userData);
      const sa = await this.createSA(userInputData);

      const { accessToken } = await this.signIn(userInputData);

      users.push({ ...sa, password: userInputData.password, accessToken });
      // accessTokens.push(accessToken);
    }
    return { users, accessTokens };
  }

  async registration(
    inputData: AuthUserType,
    expectedStatus = HttpStatus.NO_CONTENT,
  ) {
    const response = await request(this.application)
      .post(this.routing.registration())
      .send(inputData)
      .expect(expectedStatus);

    return response.body;
  }

  async registrationEmailResending(
    email: string,
    expectedStatus = HttpStatus.NO_CONTENT,
  ) {
    const response = await request(this.application)
      .post(this.routing.registrationEmailResending())
      .send({ email })
      .expect(expectedStatus);

    return response.body;
  }

  async registrationConfirmation(
    code: string | null,
    expectedStatus = HttpStatus.NO_CONTENT,
  ) {
    await request(this.application)
      .post(this.routing.registrationConfirmation())
      .send({ code })
      .expect(expectedStatus);
  }

  async passwordRecovery(
    email: string,
    expectedStatus = HttpStatus.NO_CONTENT,
  ) {
    await request(this.application)
      .post(this.routing.passwordRecovery())
      .send({ email })
      .expect(expectedStatus);
  }
  async confirmPassword(
    data: Partial<RecoveryPassDto>,
    expectedStatus = HttpStatus.NO_CONTENT,
  ) {
    await request(this.application)
      .post(this.routing.confirmPassword())
      .send(data)
      .expect(expectedStatus);
  }

  async signIn(
    user: Partial<AuthUserType>,
    expectedStatus = HttpStatus.OK,
  ): Promise<JwtTokens | any> {
    const res = await request(this.application)
      .post(this.routing.login())
      .send({
        email: user?.email || 'email',
        password: user?.password || 'qwerty',
      })
      .expect(expectedStatus);

    if (res.status === HttpStatus.OK) {
      const token = res.body;
      const refreshToken = this.extractRefreshToken(res);
      return { refreshToken, accessToken: token.accessToken } as JwtTokens;
    }

    return res.body;
  }

  async refreshToken(
    refreshToken: string,
    expectedStatus = HttpStatus.OK,
  ): Promise<JwtTokens | any> {
    const response = await request(this.application)
      .post(this.routing.refreshToken())
      .set('Cookie', `${refreshToken}`)
      .expect(expectedStatus);

    if (expectedStatus === HttpStatus.OK) {
      expect(response.body).toEqual({ accessToken: expect.any(String) });
      expect(response.headers['set-cookie']).toBeDefined();

      const { accessToken } = response.body;
      const rt = this.extractRefreshToken(response);

      return { accessToken, refreshToken: rt };
    }

    return response.body;
  }

  private extractRefreshToken(response: any) {
    return response.headers['set-cookie'][0].split(';')[0];
  }

  async me(
    accessToken: string,
    user: AuthUserType = null,
    expectedStatus = HttpStatus.OK,
  ) {
    let userProfile: UserProfileType;
    await request(this.application)
      .get(this.routing.me())
      .auth(accessToken, this.authConstants.authBearer)
      .expect(expectedStatus)
      .expect(({ body }: SuperTestBody<UserProfileType>) => {
        userProfile = body;

        user &&
          expect(userProfile).toEqual({
            email: user.email,
            userName: user.userName,
            userId: expect.any(String),
          });
      });

    return userProfile;
  }

  async logout(refreshToken: string, expectedStatus = HttpStatus.NO_CONTENT) {
    await request(this.application)
      .post(this.routing.logout())
      .set('Cookie', refreshToken)
      .expect(expectedStatus);
  }

  async loginThroughSetDeviceId(
    deviceId: number,
    auth: AuthUserType,
    expectedStatus = HttpStatus.OK,
  ) {
    await request(this.application)
      .post(this.routing.login())
      .set('user-agent', `device-${deviceId + 1}`)
      .send({ email: auth.email, password: auth.password })
      .expect(expectedStatus);
  }

  async getUserActiveSessions(
    refreshToken: string,
    expectedStatus = HttpStatus.OK,
  ): Promise<SecurityViewDeviceModel[]> {
    let userSessions: SecurityViewDeviceModel[];
    await request(this.application)
      .get(this.securityRouting.getUserSessions())
      .set('Cookie', refreshToken)
      .expect(expectedStatus)
      .expect(({ body }: SuperTestBody<SecurityViewDeviceModel[]>) => {
        userSessions = body;
      });
    return userSessions;
  }

  async deleteSpecificSession(
    refreshToken: string,
    deviceId: string,
    expectedStatus = HttpStatus.NO_CONTENT,
  ) {
    await request(this.application)
      .delete(this.securityRouting.removeSession(deviceId))
      .set('Cookie', refreshToken)
      .expect(expectedStatus);
  }

  async deleteSessionsExceptCurrent(
    refreshToken: string,
    expectedStatus = HttpStatus.NO_CONTENT,
  ) {
    await request(this.application)
      .delete(this.securityRouting.removeOtherSessions())
      .set('Cookie', refreshToken)
      .expect(expectedStatus);
  }
}
