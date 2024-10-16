import { HttpStatus, INestApplication } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

type ImageDtoType = {
  fileName: string;
  contentType: string;
  buffer: Buffer;
};

export class ProfileTestManager extends BaseTestManager {
  protected readonly routing: AuthUsersRouting;
  protected readonly saRouting: SAUsersRouting;
  protected readonly profileRouting: ProfileRouting;
  protected usersRepo: Prisma.UserAccountDelegate<DefaultArgs>;
  constructor(
    protected readonly app: INestApplication,
    private prisma: DatabaseService,
  ) {
    super(app);
    this.profileRouting = new ProfileRouting();
    this.usersRepo = this.prisma.userAccount;
  }

  createInputData(
    field?: Partial<FillOutProfileInputModel> | object,
  ): FillOutProfileInputModel {
    if (!field) {
      return {
        userName: ' ',
        firstName: ' ',
        lastName: ' ',
      };
    }
    const model = field as FillOutProfileInputModel;
    return {
      userName: model.userName || 'newUserName',
      firstName: model.firstName || 'newFirstName',
      lastName: model.lastName || 'newLastName',
      dateOfBirth: model.dateOfBirth || '12.12.1212',
      city: model.city || 'Berlin',
      about: model.about || 'about me',
      country: model.country || 'Germany',
    };
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
        console.log(body);
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
      console.log(profileData, users);

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
}
