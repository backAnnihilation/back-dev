import { BaseRepository } from '@file/core/db/base.files.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  ProfileImageDocument,
  ProfileImageMeta,
  ProfileImageModel,
} from '../domain/entities/user-profile-image-meta.schema';

@Injectable()
export class ProfilesRepository extends BaseRepository<ProfileImageDocument> {
  constructor(
    @InjectModel(ProfileImageMeta.name) profileImageModel: ProfileImageModel,
  ) {
    super(profileImageModel);
  }
}
