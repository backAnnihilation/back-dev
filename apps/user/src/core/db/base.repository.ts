import { PrismaClient } from '@prisma/client';

export interface IBaseRepository<T> {
  getById(id: string): Promise<T>;
  save(entity: T, data: any): Promise<void>;
  delete(id: string): Promise<void>;
}

export abstract class BaseRepository<TModel, TData, TResult> {
  constructor(protected readonly prismaModel: TModel) {}

  async saveEntity(data: TData): Promise<TResult> {
    try {
      return await (this.prismaModel as any).create({ data });
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to save entity: ${error}`);
    }
  }

  async getById(id: string): Promise<TResult | null> {
    try {
      return await (this.prismaModel as any).findUnique({ where: { id } });
    } catch (error) {
      console.error(`Failed to get entity: ${error}`);
      return null;
    }
  }

  async getAll(): Promise<TResult | null> {
    try {
      return await (this.prismaModel as any).findMany();
    } catch (error) {
      console.error(`Failed to get entities: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<TResult> {
    try {
      return await (this.prismaModel as any).update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update entity: ${error}`);
    }
  }

  async delete(id: string): Promise<TResult> {
    try {
      return await (this.prismaModel as any).delete({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to delete entity: ${error}`);
    }
  }
}
