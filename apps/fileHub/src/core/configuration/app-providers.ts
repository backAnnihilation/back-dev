import { Storage } from '@file/core/configuration/configuration';
import { Provider } from '@nestjs/common';
import { FilesQueryRepository } from '../../features/profile/api/files.query.repository';
import { FilesScheduleService } from '../../features/profile/application/services/file-metadata.schedule.service';
import { FilesService } from '../../features/profile/application/services/file-metadata.service';
import { FilesBaseApiService } from '../../features/profile/application/services/file.base.service';
import { UploadFileUseCase } from '../../features/profile/application/use-cases/upload-file.use-case';
import { FilesRepository } from '../../features/profile/infrastructure/files.repository';
import { ApiKeyGuard } from '../../features/profile/infrastructure/guards/api-key.guard';
import { FileExtractPipe } from '../../features/profile/infrastructure/pipes/extract-file-characters.pipe';
import { FilesStorageAdapter } from '../adapters/local-files-storage.adapter';
import { S3FilesStorageAdapter } from '../adapters/s3-files-storage.adapter';
import { ConfigService } from '@nestjs/config';
import {
  RmqOptions,
  Transport,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { RmqConfig } from '@config/rmq.config';
// import { CreatePostUseCase } from 'apps/user/src/features/post/application/use-cases/create-post.use-case';

export const providers: Provider[] = [
  FilesRepository,
  UploadFileUseCase,
  // CreatePostUseCase,
  ApiKeyGuard,
  FilesScheduleService,
  FileExtractPipe,
  FilesService,
  FilesBaseApiService,
  FilesQueryRepository,
  {
    provide: FilesStorageAdapter,
    useClass:
      process.env.STORAGE === Storage.S3
        ? S3FilesStorageAdapter
        : FilesStorageAdapter,
  },
];
