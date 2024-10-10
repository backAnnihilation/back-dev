import { Storage } from '@file/core/configuration/configuration';
import { Provider } from '@nestjs/common';
import { PostsQueryRepository } from '../../features/file/api/post-image.query.repository';
import { ProfilesQueryRepository } from '../../features/file/api/profile-image.query.repository';
import { FilesService } from '../../features/file/application/services/file-metadata.service';
import { FilesApiService } from '../../features/file/application/services/file.base.service';
import { PostsApiService } from '../../features/file/application/services/posts-api.service';
import { ProfilesApiService } from '../../features/file/application/services/profiles-api.service';
import { S3BucketMaintenanceService } from '../../features/file/application/services/schedule/s3-bucket-maintenance.service';
import { ProfileImageDeliveryApprovedUseCase } from '../../features/file/application/use-cases/approved-profile-image-urls-delivery.use-case';
import { UploadPostImageUseCase } from '../../features/file/application/use-cases/upload-post-image.use-case';
import { UploadProfileImageUseCase } from '../../features/file/application/use-cases/upload-profile-image.use-case';
import { OutboxRepository } from '../../features/file/infrastructure/events.outbox.repository';
import { ApiKeyGuard } from '../../features/file/infrastructure/guards/api-key.guard';
import { FileExtractPipe } from '../../features/file/infrastructure/pipes/extract-file-characters.pipe';
import { PostsRepository } from '../../features/file/infrastructure/post-files.repository';
import { ProfilesRepository } from '../../features/file/infrastructure/profiles-image.repository';
import { ProcessingImageUseCase } from '../../features/fileProcessing/application/use-cases/processing-images.use-case';
import { FilesStorageAdapter } from '../adapters/local-files-storage.adapter';
import { RmqAdapter } from '../adapters/rmq.adapter';
import { S3FilesStorageAdapter } from '../adapters/s3-files-storage.adapter';
import { OutboxService } from '../../features/file/application/services/schedule/outbox.service';

export const providers: Provider[] = [
  PostsRepository,
  ProfilesRepository,
  OutboxRepository,
  ProfilesQueryRepository,
  PostsQueryRepository,
  ApiKeyGuard,
  RmqAdapter,
  S3BucketMaintenanceService,
  FileExtractPipe,
  FilesService,
  ProfileImageDeliveryApprovedUseCase,
  OutboxService,
  FilesApiService,
  PostsApiService,
  ProfilesApiService,
  ProfilesQueryRepository,
  PostsQueryRepository,
  UploadProfileImageUseCase,
  UploadPostImageUseCase,
  ProcessingImageUseCase,
  {
    provide: FilesStorageAdapter,
    useClass:
      process.env.STORAGE === Storage.S3
        ? S3FilesStorageAdapter
        : FilesStorageAdapter,
  },
];
