import { FileMetadata, ImageCategory } from '@app/shared';
import {
  FilesStorageAdapter,
  SubsRepository,
} from '@file/core/adapters/local-files-storage.adapter';
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

import { Bucket } from '../../api/models/enums/file-models.enum';
import {
  ContentType,
  UploadFileOutputType,
} from '../../api/models/output-models/file-output-types';

@Injectable()
export class SubsService {
  constructor(private readonly subsRepo: SubsRepository) {}

  async createNewSubscription(subsDto: any) {
    try {

    } catch (e) {

    }
  }
}
