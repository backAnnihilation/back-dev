import { HttpStatus, INestApplication } from '@nestjs/common';
import { Prisma, Subs, SubStatus } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { readFile } from 'fs/promises';
import { resolve } from 'node:path';
import { basename } from 'path';
import * as request from 'supertest';
import { DatabaseService } from '../../../src/core/db/prisma/prisma.service';
import { EditProfileInputModel } from '../../../src/features/profile/api/models/input/edit-profile.model';
import { FillOutProfileInputModel } from '../../../src/features/profile/api/models/input/fill-out-profile.model';
import { UserProfileViewModel } from '../../../src/features/profile/api/models/output/profile.view.model';
import { SuperTestBody } from '../models/body.response.model';
import { ImageNames } from '../models/image-names.enum';
import { AuthUsersRouting } from '../routes/auth-users.routing';
import { ProfileRouting } from '../routes/profile-user.routing';
import { SAUsersRouting } from '../routes/sa-users.routing';
import { BaseTestManager } from './BaseTestManager';
import { AuthUserType } from '../../../src/features/auth/api/models/auth.output.models/auth.user.types';
import { profileImages } from '../utils/test-constants';
import { SubsRouting } from '../routes/subs.routing';
import {
  SubViewModel,
  ViewSubsCount,
} from '../../../src/features/subs/api/models/output-models/view-sub-types.model';

export class ProfileTestManager extends BaseTestManager {
  private readonly subsRouting: SubsRouting;
  private readonly profileRouting: ProfileRouting;
  private readonly profilesRepo: Prisma.UserProfileDelegate;
  private readonly subsRepo: Prisma.SubsDelegate;
  constructor(
    app: INestApplication,
    private prisma: DatabaseService,
  ) {
    super(app);
    this.profileRouting = new ProfileRouting();
    this.subsRouting = new SubsRouting();
    this.profilesRepo = this.prisma.userProfile;
    this.subsRepo = this.prisma.subs;
  }

  createInputData(
    field?: Partial<FillOutProfileInputModel> | object,
  ): FillOutProfileInputModel {
    let profileModel = {
      userName: ' ',
      firstName: ' ',
      lastName: ' ',
    };
    if (field) {
      const model = field as FillOutProfileInputModel;
      profileModel = {
        userName: model.userName || 'newUserName',
        firstName: model.firstName || 'newFirstName',
        lastName: model.lastName || 'newLastName',
        dateOfBirth: model.dateOfBirth || '12.12.1212',
        city: model.city || 'Berlin',
        about: model.about || 'about me',
        country: model.country || 'Germany',
      } as FillOutProfileInputModel;
    }
    return profileModel;
  }

  async getProfile(
    profileId: string,
    expectedStatus = HttpStatus.OK,
  ): Promise<UserProfileViewModel> {
    let profile: UserProfileViewModel;
    await request(this.application)
      .get(this.profileRouting.getProfile(profileId))
      .expect(expectedStatus)
      .expect(({ body, status }: SuperTestBody<UserProfileViewModel>) => {
        status === expectedStatus && (profile = body);
      });
    return profile;
  }

  async fillOutProfile(
    accessToken: string,
    profileDto: FillOutProfileInputModel,
    expectedStatus = HttpStatus.CREATED,
  ) {
    let profile: UserProfileViewModel;
    await request(this.application)
      .post(this.profileRouting.fillOutProfile())
      .auth(accessToken, this.authConstants.authBearer)
      .send(profileDto)
      .expect(({ body }: SuperTestBody<UserProfileViewModel>) => {
        profile = body;
      })
      .expect(expectedStatus);

    return profile;
  }

  async uploadPhoto(
    accessToken: string,
    imageName: ImageNames,
    expectedStatus = HttpStatus.CREATED,
  ) {
    const { buffer, contentType, filename } =
      await this.retrieveImageMeta(imageName);

    await request(this.application)
      .post(this.profileRouting.uploadPhoto())
      .auth(accessToken, this.authConstants.authBearer)
      .attach('image', buffer, { filename, contentType })
      .expect(expectedStatus);
  }

  async createProfiles(
    users: (AuthUserType & { accessToken: string })[],
  ): Promise<UserProfileViewModel[]> {
    const { LAST_NAMES, FIRST_NAMES, CITIES, COUNTRIES, BIRTH_DATES } =
      this.constants;
    const profiles = [];

    for (let i = 0; i < users.length; i++) {
      const profileData = this.createInputData({
        userName: users[i].userName,
        firstName: FIRST_NAMES[i] || `firstName${i}`,
        lastName: LAST_NAMES[i] || `lastName${i}`,
        dateOfBirth: BIRTH_DATES[i] || '12.12.1912',
        city: CITIES[i] || 'Rome',
        country: COUNTRIES[i] || 'Italy',
      });

      const profile = await this.fillOutProfile(
        users[i].accessToken,
        profileData,
      );
      profiles.push(profile);
    }
    return profiles;
  }

  async editProfile(
    accessToken: string,
    profileDto: EditProfileInputModel,
    expectedStatus = HttpStatus.NO_CONTENT,
  ) {
    await request(this.application)
      .put(this.profileRouting.editProfile())
      .auth(accessToken, this.authConstants.authBearer)
      .send(profileDto)
      .expect(expectedStatus);
  }

  async subscribe(
    accessToken: string,
    profileId: string,
    expectedStatus = HttpStatus.CREATED,
  ) {
    let sub: SubViewModel;
    await request(this.application)
      .post(this.subsRouting.subscribe(profileId))
      .auth(accessToken, this.authConstants.authBearer)
      .expect(expectedStatus)
      .expect(({ body, status }: SuperTestBody<SubViewModel>) => {
        if (status === HttpStatus.CREATED)
          expect(body.status).toBe(SubStatus.active);
        sub = body;
      });
    return sub;
  }

  async unsubscribe(
    accessToken: string,
    profileId: string,
    expectedStatus = HttpStatus.NO_CONTENT,
  ) {
    await request(this.application)
      .put(this.subsRouting.unsubscribe(profileId))
      .auth(accessToken, this.authConstants.authBearer)
      .expect(expectedStatus);
  }

  async getUserFollowCounts(userId: string, expectedStatus = HttpStatus.OK) {
    let sub: ViewSubsCount;
    await request(this.application)
      .get(this.subsRouting.getCountFollow(userId))
      .expect(HttpStatus.OK)
      .expect(({ body }: SuperTestBody<ViewSubsCount>) => {
        expectedStatus === HttpStatus.OK && (sub = body);
      });
    return sub;
  }

  async getFollowers(
    id: string,
    accessToken: string,
    expectedStatus = HttpStatus.OK,
  ) {
    let sub: SubViewModel;
    await request(this.application)
      .get(this.subsRouting.getFollowers(id))
      .auth(accessToken || '', this.authConstants.authBearer)
      .expect(expectedStatus)
      .expect(({ body, status }: SuperTestBody<SubViewModel>) => {
        if (status === HttpStatus.OK)
          expect(body.status).toBe(SubStatus.active);
        sub = body;
      });
    return sub;
  }

  async getFollowing(
    id: string,
    accessToken: string,
    expectedStatus = HttpStatus.OK,
  ) {
    let sub: SubViewModel;
    await request(this.application)
      .get(this.subsRouting.getFollowing(id))
      .auth(accessToken || '', this.authConstants.authBearer)
      .expect(expectedStatus)
      .expect(({ body, status }: SuperTestBody<SubViewModel>) => {
        if (status === HttpStatus.OK)
          expect(body.status).toBe(SubStatus.active);
        sub = body;
      });
    return sub;
  }
}
