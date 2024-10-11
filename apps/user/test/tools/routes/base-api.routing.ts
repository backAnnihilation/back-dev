import { Environment } from '@app/shared';

export const BASE_PREFIX = '/api/v1';

export abstract class BaseRouting {
  protected readonly baseUrl: string;
  protected readonly _basePrefix = BASE_PREFIX;
  private readonly env = process.env.ENV;

  constructor(baseUrl: string) {
    let basePrefix = this._basePrefix;
    this.env === Environment.DEVELOPMENT && (basePrefix = '');
    this.baseUrl = `${basePrefix}${baseUrl}`;
  }
}
