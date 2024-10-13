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

  async getById<T extends keyof PrismaClient>(
    model: T,
    id: string,
  ): Promise<T | null> {
    try {
      return await (this.prisma[model] as any).findUnique({ where: { id } });
    } catch (error) {
      console.error(`Failed to get ${model as string}: ${error}`);
      return null;
    }
  }

  async getAll<T extends keyof PrismaClient>(model: T): Promise<T[] | null> {
    try {
      return await (this.prisma[model] as any).findMany();
    } catch (error) {
      console.error(`Failed to get ${model as string}: ${error}`);
    }
  }

  async update(model: keyof PrismaClient, id: string, data: any): Promise<any> {
    try {
      return await (this.prisma[model] as any).update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update ${model as string}: ${error}`);
    }
  }

  async delete<T extends keyof PrismaClient>(
    model: T,
    id: string,
  ): Promise<any> {
    try {
      return await (this.prisma[model] as any).delete({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to delete ${model as string}: ${error}`);
    }
  }
}
