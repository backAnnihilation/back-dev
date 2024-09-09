import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BaseTestManager } from './BaseTestManager';
import { ErrorsMessages } from '../../../core/utils/error-handler';
import { PaginationViewModel } from '../../../core/utils/sorting-base-filter';
import { SAQueryFilter } from '../../../src/features/admin/api/models/outputSA.models.ts/query-filters';
import { SAViewType } from '../../../src/features/admin/api/models/user.view.models/userAdmin.view-type';
import { AuthUserType } from '../../../src/features/auth/api/models/auth.output.models/auth.user.types';
import {
  AuthConstantsType,
  constantsForDataTesting,
} from '../utils/test-constants';
import { SAUsersRouting } from '../routes/sa-users.routing';

export class SATestManager extends BaseTestManager {
  protected readonly constants: AuthConstantsType;
  protected readonly routing: SAUsersRouting;
  constructor(protected readonly app: INestApplication) {
    super(app);
    this.routing = new SAUsersRouting();
    this.constants = constantsForDataTesting.auth;
  }

  createInputData(field?: AuthUserType | any, i: number = 1): AuthUserType {
    if (!field) {
      return {
        userName: '',
        password: '',
        email: '',
      };
    } else {
      return {
        userName: field.userName || `ykt91${i % 2 === 0 ? 'eU' : 'Ue'}6F${i}`,
        password: field.password || `qwerty${i}`,
        email:
          field.email || `qwert${i % 2 === 0 ? i + 'QW' : i + 'wq'}@yaol.com`,
      };
    }
  }

  // createBanRestriction = (data: Partial<UserRestrictionDto>) => ({
  //   isBanned: data.isBanned,
  //   banReason: data.banReason || 'The reason why user was banned or unbunned',
  // });

  async createSA(
    inputData: AuthUserType,
    expectedStatus = HttpStatus.CREATED,
  ): Promise<{ user: SAViewType }> {
    const response = await request(this.application)
      .post(this.routing.createSA())
      .auth(
        this.constants.basicUser,
        this.constants.basicPass,
        this.constants.authBasic,
      )
      .send(inputData)
      .expect(expectedStatus);

    const user = response.body;

    return { user };
  }

  async getUsers(
    query?: Partial<SAQueryFilter>,
    expectStatus = HttpStatus.OK,
  ): Promise<PaginationViewModel<any>> {
    const response = await request(this.application)
      .get(this.routing.getUsers())
      .auth(
        this.constants.basicUser,
        this.constants.basicPass,
        this.constants.authBasic,
      )
      .query(query)
      .expect(expectStatus);

    return response.body;
  }

  async banUser(
    userId: string,
    reason: any,
    expectStatus = HttpStatus.NO_CONTENT,
  ) {
    await request(this.application)
      .put(this.routing.banUnbanRestriction(userId))
      .auth(
        this.constants.basicUser,
        this.constants.basicPass,
        this.constants.authBasic,
      )
      .send(reason)
      .expect(expectStatus);
  }
}
