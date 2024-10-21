import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { formatBytes } from '../../core/infrastructure/utils/format-file-size';
import { AwsConfigType } from '../configuration/configuration';
import { S3BucketMaintenanceService } from '../../features/file/application/services/schedule/s3-bucket-maintenance.service';
import { UploadFileOutputType } from '../../features/file/api/models/output-models/file-output-types';

@Injectable()
export class S3FilesStorageAdapter {
  s3Client: S3Client;
  mainDomain: string;
  bucketName: string;

  constructor(
    private configService: ConfigService<AwsConfigType>,
    private filesScheduleService: S3BucketMaintenanceService,
  ) {
    const {
      accessPoint: endpoint,
      accessKeyId,
      region,
      secretAccessKey,
    } = this.configService.getOrThrow('aws', { infer: true });

    const { hostname } = new URL(endpoint);
    this.mainDomain = hostname;
    const params = {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      endpoint,
      forcePathStyle: true,
    } as S3ClientConfig;

    this.s3Client = new S3Client(params);
  }

  async uploadFile(
    bucketParams: PutObjectCommandInput,
  ): Promise<UploadFileOutputType> {
    const { Bucket: bucketName, Key: key } = bucketParams;
    await this.checkBucketBeforeUpload(bucketName);
    try {
      const { ETag } = await this.s3Client.send(
        new PutObjectCommand(bucketParams),
      );
      return {
        url: `https://${this.mainDomain}/${bucketName}/${key}`,
        id: ETag.split('"')[1],
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private checkBucketBeforeUpload = async (bucketName: string) => {
    await this.ensureBucketExists(bucketName);
    await this.ensureBucketHasEnoughSpace(bucketName);
  };

  private ensureBucketExists = async (bucketName: string) => {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch (error) {
      if (error.name === 'NotFound' || error.$metadata.httpStatusCode === 404) {
        try {
          await this.s3Client.send(
            new CreateBucketCommand({ Bucket: bucketName }),
          );
          console.log(`Bucket "${bucketName}" created successfully.`);
        } catch (createError) {
          console.error(
            `Failed to create bucket "${bucketName}":`,
            createError,
          );
          throw createError;
        }
      } else {
        console.error(`Error checking bucket "${bucketName}":`, error);
        throw error;
      }
    }
  };

  private ensureBucketHasEnoughSpace = async (bucketName: string) => {
    const totalSize =
      await this.filesScheduleService.getTotalBucketSize(bucketName);
    const maxBucketSize = 880 * 1024 * 1024; // ~900 mb
    if (totalSize > maxBucketSize) {
      const formattedTotalSize = formatBytes(totalSize);
      const formattedMaxSize = formatBytes(maxBucketSize);
      console.warn(
        `Bucket "${bucketName}", size: ${formattedTotalSize} exceeds allocated space ${formattedMaxSize} is running out of space. Starting cleanup...`,
      );
      await this.filesScheduleService.cleanUpBucket(bucketName, 10);
    }
  };
}
