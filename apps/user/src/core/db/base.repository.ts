import { PrismaClient } from '@prisma/client';

export interface IBaseRepository<T> {
  getById(id: string): Promise<T>;
  save(entity: T, data: any): Promise<void>;
  delete(id: string): Promise<void>;
}

export class BaseRepository {
  constructor(protected prisma: PrismaClient) {}
  async saveEntity<T extends keyof PrismaClient>(
    model: T,
    data: any,
  ): Promise<any> {
    try {
      return await (this.prisma[model] as any).create({ data });
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to save ${model as string}: ${error}`);
    }
  }
}
