import { HttpStatus, INestApplication } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import * as request from 'supertest';
import { DatabaseService } from '../../../src/core/db/prisma/prisma.service';
import { SAViewType } from '../../../src/features/admin/api/models/user.view.models/userAdmin.view-type';
import { JwtTokens } from '../../../src/features/auth/api/models/auth-input.models.ts/jwt.types';
import { RecoveryPassDto } from '../../../src/features/auth/api/models/auth-input.models.ts/recovery.model';
import { UserProfileType } from '../../../src/features/auth/api/models/auth.output.models/auth.output.models';
import { AuthUserType } from '../../../src/features/auth/api/models/auth.output.models/auth.user.types';
import { SecurityViewDeviceModel } from '../../../src/features/security/api/models/security.view.models/security.view.types';
import { FillOutProfileInputModel } from '../../../src/features/profile/api/models/input/fill-out-profile.model';
import { SuperTestBody } from '../models/body.response.model';
import { AuthUsersRouting } from '../routes/auth-users.routing';
import { ProfileRouting } from '../routes/profile-user.routing';
import { SAUsersRouting } from '../routes/sa-users.routing';
import { SecurityRouting } from '../routes/security.routing';
import { UserProfileViewModel } from '../../../src/features/profile/api/models/output/profile.view.model';
import { EditProfileInputModel } from '../../../src/features/profile/api/models/input/edit-profile.model';
import { BaseTestManager } from './BaseTestManager';
import { readFile } from 'fs/promises';
import { resolve } from 'node:path';
import { ImageNames } from '../models/image-names.enum';
import { basename } from 'path';

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
      firstName: model.firstName || 'test@gmail.com',
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
        if (status === HttpStatus.OK) {
          profile = body;
        }
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
      .auth(accessToken, this.constants.authBearer)
      .send(profileDto)
      .expect(expectedStatus)
      .expect(({ body }: SuperTestBody<UserProfileViewModel>) => {
        profile = body;
      });
    return profile;
  }

  async uploadPhoto(
    accessToken: string,
    imageDto: ImageDtoType,
    expectedStatus = HttpStatus.CREATED,
  ) {
    let { buffer, contentType, fileName } = imageDto;
    const filename = fileName || 'profile';
    contentType = contentType || 'image/png';

    await request(this.application)
      .post(this.profileRouting.uploadPhoto())
      .auth(accessToken, this.constants.authBearer)
      .attach('image', buffer, { filename, contentType })
      .expect(expectedStatus);
  }

  async retrieveImageMeta(imageName: ImageNames): Promise<ImageDtoType> {
    const profileImages = {
      fresco: '../images/fresco.jpg',
      jpeg: '../images/jpeg.jpg',
      insta: '../images/insta.png',
    };
    const imagePath = resolve(__dirname, profileImages[imageName]);
    const baseName = basename(imagePath);
    const contentType =
      baseName === 'fresco.jpg'
        ? 'image/jpeg'
        : `image/${baseName.split('.')[1]}`;
    const buffer = await this.retrieveFileBuffer(imagePath);
    const fileName = this.parseFileName(baseName);

    return {
      fileName,
      contentType,
      buffer,
    };
  }
  private retrieveFileBuffer = async (filePath: string) => readFile(filePath);
  private parseFileName = (fileName: string) => fileName.split('.')[0];

  async editProfile(
    accessToken: string,
    profileDto: EditProfileInputModel,
    expectedStatus = HttpStatus.NO_CONTENT,
  ) {
    await request(this.application)
      .put(this.profileRouting.editProfile())
      .auth(accessToken, this.constants.authBearer)
      .send(profileDto)
      .expect(expectedStatus);
  }
}
