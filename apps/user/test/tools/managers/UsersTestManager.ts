import { HttpStatus, INestApplication } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import * as request from 'supertest';
import { RoutingEnum } from '../../../core/routes/routing';
import { JwtTokens } from '../../../src/features/auth/api/models/auth-input.models.ts/jwt.types';
import { UserProfileType } from '../../../src/features/auth/api/models/auth.output.models/auth.output.models';
import { AuthUserType } from '../../../src/features/auth/api/models/auth.output.models/auth.user.types';
import { SuperTestBody } from '../models/body.response.model';
import { AuthUsersRouting } from '../routes/auth-users.routing';
import { BaseTestManager } from './BaseTestManager';
import { SAUsersRouting } from '../routes/sa-users.routing';
import { RecoveryPassDto } from '../../../src/features/auth/api/models/auth-input.models.ts/recovery.model';
import { SAViewType } from '../../../src/features/admin/api/models/user.view.models/userAdmin.view-type';

export class UsersTestManager extends BaseTestManager {
  protected readonly routing: AuthUsersRouting;
  protected readonly saRouting: SAUsersRouting;
  protected usersRepo: Prisma.UserAccountDelegate<DefaultArgs>;
  constructor(
    protected readonly app: INestApplication,
    private prisma: PrismaClient
  ) {
    super(app);
    this.routing = new AuthUsersRouting();
    this.saRouting = new SAUsersRouting();
    this.usersRepo = this.prisma.userAccount;
  }

  createInputData(field?: AuthUserType | object): AuthUserType {
    if (!field) {
      return {
        userName: ' ',
        password: ' ',
        email: ' ',
      };
    } else {
      return {
        userName: (field as AuthUserType).userName || 'userName',
        password: (field as AuthUserType).password || 'password',
        email: (field as AuthUserType).email || 'test@gmail.com',
      };
    }
  }

  expectCorrectModel(createModel: any, responseModel: any) {
    expect(createModel.name).toBe(responseModel.name);
    expect(createModel.email).toBe(responseModel.email);
  }

  async createSA(
    inputData: AuthUserType,
    expectedStatus = HttpStatus.CREATED
  ): Promise<AuthUserType> {
    let admin: AuthUserType;
    await request(this.application)
      .post(this.saRouting.createSA())
      .auth(
        this.constants.basicUser,
        this.constants.basicPass,
        this.constants.authBasic
      )
      .send(inputData)
      .expect(({ body }: SuperTestBody<SAViewType>) => {
        admin = body;
        admin['password'] = inputData.password;
      })
      .expect(expectedStatus);

    return admin;
  }

  async createUsers(
    numberOfUsers = 3
  ): Promise<{ users: AuthUserType[]; accessTokens: string[] }> {
    const users: AuthUserType[] = [];
    const accessTokens: string[] = [];

    for (let i = 0; i < numberOfUsers; i++) {
      const userData = {
        userName: `login${i}`,
        email: `email${i}@test.test`,
      };

      const userInputData = this.createInputData(userData);
      const sa = await this.createSA(userInputData);

      const { accessToken } = await this.signIn(userInputData);

      users.push({ ...sa, password: userInputData.password });
      accessTokens.push(accessToken);
    }
    return { users, accessTokens };
  }

  async registration(
    inputData: AuthUserType,
    expectedStatus = HttpStatus.NO_CONTENT
  ) {
    const response = await request(this.application)
      .post(this.routing.registration())
      .send(inputData)
      .expect(expectedStatus);

    return response.body;
  }

  async registrationEmailResending(
    email: string,
    expectedStatus = HttpStatus.NO_CONTENT
  ) {
    const response = await request(this.application)
      .post(this.routing.registrationEmailResending())
      .send({ email })
      .expect(expectedStatus);

    return response.body;
  }

  async registrationConfirmation(
    code: string | null,
    expectedStatus = HttpStatus.NO_CONTENT
  ) {
    await request(this.application)
      .post(this.routing.registrationConfirmation())
      .send({ code })
      .expect(expectedStatus);
  }

  async passwordRecovery(
    email: string,
    expectedStatus = HttpStatus.NO_CONTENT
  ) {
    await request(this.application)
      .post(this.routing.passwordRecovery())
      .send({ email })
      .expect(expectedStatus);
  }
  async confirmPassword(
    data: Partial<RecoveryPassDto>,
    expectedStatus = HttpStatus.NO_CONTENT
  ) {
    await request(this.application)
      .post(this.routing.confirmPassword())
      .send(data)
      .expect(expectedStatus);
  }

  async signIn(
    user: Partial<AuthUserType>,
    expectedStatus = HttpStatus.OK
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
    expectedStatus = HttpStatus.OK
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

  checkUserData(responseModel: any, expectedResult: any) {
    expect(responseModel).toEqual(expectedResult);
  }

  async me(
    accessToken: string,
    user: AuthUserType = null,
    expectedStatus = HttpStatus.OK
  ) {
    let userProfile: UserProfileType;
    await request(this.application)
      .get(this.routing.me())
      .auth(accessToken, this.constants.authBearer)
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
      .set('Cookie', `${refreshToken}`)
      .expect(expectedStatus);
  }

  private extractRefreshToken(response: any) {
    return response.headers['set-cookie'][0].split(';')[0];
  }
}
