import { Storage } from '@file/core/configuration/configuration';
import { Provider } from '@nestjs/common';
import { PostsQueryRepository } from '../../features/file/api/post-image.query.repository';
import { FilesScheduleService } from '../../features/file/application/services/file-metadata.schedule.service';
import { FilesService } from '../../features/file/application/services/file-metadata.service';
import { UploadFileUseCase } from '../../features/file/application/use-cases/upload-file.use-case';
import { PostsRepository } from '../../features/file/infrastructure/post-files.repository';
import { ApiKeyGuard } from '../../features/file/infrastructure/guards/api-key.guard';
import { FileExtractPipe } from '../../features/file/infrastructure/pipes/extract-file-characters.pipe';
import { FilesStorageAdapter } from '../adapters/local-files-storage.adapter';
import { S3FilesStorageAdapter } from '../adapters/s3-files-storage.adapter';
import { UploadProfileImageUseCase } from '../../features/file/application/use-cases/upload-profile-image.use-case';
import { UploadPostImageUseCase } from '../../features/file/application/use-cases/upload-post-image.use-case';
import { ProfilesRepository } from '../../features/file/infrastructure/profiles-image.repository';
import { ProfilesQueryRepository } from '../../features/file/api/profile-image.query.repository';
import { FilesApiService } from '../../features/file/application/services/file.base.service';
import { PostsApiService } from '../../features/file/application/services/posts-api.service';
import { ProfilesApiService } from '../../features/file/application/services/profiles-api.service';
import { ValidatePayloadPipe } from '../../features/file/infrastructure/pipes/input-data-validate.pipe';

export const providers: Provider[] = [
  PostsRepository,
  ProfilesRepository,
  ProfilesQueryRepository,
  PostsQueryRepository,
  UploadFileUseCase,
  ApiKeyGuard,
  FilesScheduleService,
  FileExtractPipe,
  FilesService,
  FilesApiService,
  PostsApiService,
  ProfilesApiService,
  ProfilesQueryRepository,
  PostsQueryRepository,
  UploadProfileImageUseCase,
  UploadPostImageUseCase,
  {
    provide: FilesStorageAdapter,
    useClass:
      process.env.STORAGE === Storage.S3
        ? S3FilesStorageAdapter
        : FilesStorageAdapter,
  },
];
