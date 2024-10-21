import { HttpServer, INestApplication } from '@nestjs/common';
import { SortDirection } from '@app/shared';
import {
  AuthConstantsType,
  constantsTesting,
  InputConstantsType,
  profileImages,
} from '../utils/test-constants';
import { readFile } from 'fs/promises';
import { resolve } from 'node:path';
import { basename } from 'path';
import { ImageNames } from '../models/image-names.enum';

type ImageDtoType = {
  filename: string;
  contentType: string;
  buffer: Buffer;
};

export class BaseTestManager {
  protected readonly authConstants: AuthConstantsType;
  protected readonly application: INestApplication<HttpServer>;
  protected readonly constants: InputConstantsType;

  constructor(protected readonly app: INestApplication) {
    this.authConstants = constantsTesting.auth;
    this.constants = constantsTesting.inputData;
    this.application = this.app.getHttpServer();
  }

  protected async retrieveImageMeta(
    imageName: ImageNames,
  ): Promise<ImageDtoType> {
    const imagePath = resolve(__dirname, profileImages[imageName]);
    const baseName = basename(imagePath);
    const contentType =
      baseName === 'fresco.jpg'
        ? 'image/jpeg'
        : `image/${baseName.split('.')[1]}` || 'image/png';

    const buffer = await this.retrieveFileBuffer(imagePath);
    const filename = this.parseFileName(baseName) || 'filename';

    return {
      filename,
      contentType,
      buffer,
    };
  }

  private retrieveFileBuffer = async (filePath: string) => readFile(filePath);
  private parseFileName = (fileName: string) => fileName.split('.')[0];

  assertMatch(responseData: any, expectedResult: any) {
    expect(responseData).toEqual(expectedResult);
  }
  isSortedByField = <T>(sortData: SortedByFieldType<T>) => {
    let { field, entities, sortDirection } = sortData;
    let isSorted = true;

    field = field === 'title' ? ('name' as any) : field;

    for (let i = 0; i < entities.length - 1; i++) {
      const currentValue = entities[i][field];
      const nextValue = entities[i + 1][field];

      if (typeof currentValue === 'string' && typeof nextValue === 'string') {
        if (sortDirection.toUpperCase() === SortDirection.ASC) {
          if (currentValue.localeCompare(nextValue) > 0) {
            isSorted = false;
            break;
          }
        } else {
          if (currentValue.localeCompare(nextValue) < 0) {
            isSorted = false;
            break;
          }
        }
      } else if (
        typeof currentValue === 'number' &&
        typeof nextValue === 'number'
      ) {
        if (sortDirection.toUpperCase() === SortDirection.ASC) {
          if (currentValue > nextValue) {
            isSorted = false;
            break;
          }
        } else {
          if (currentValue < nextValue) {
            isSorted = false;
            break;
          }
        }
      } else if (currentValue instanceof Date && nextValue instanceof Date) {
        if (sortDirection.toUpperCase() === SortDirection.ASC) {
          if (currentValue.getTime() > nextValue.getTime()) {
            isSorted = false;
            break;
          }
        } else {
          if (currentValue.getTime() < nextValue.getTime()) {
            isSorted = false;
            break;
          }
        }
      } else {
        throw new Error(
          `Unsupported field type for sorting: ${typeof currentValue}`,
        );
      }
    }

    expect(isSorted).toBe(true);
  };
}

type SortedByFieldType<T> = {
  entities: T[];
  field: keyof T;
  sortDirection: SortDirection;
};
