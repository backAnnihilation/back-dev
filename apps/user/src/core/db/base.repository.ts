import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
import { PrismaTransactionClient } from '../application/use-cases/base-prisma-transaction.use-case';

export interface IBaseRepository<T> {
  getById(id: string): Promise<T>;
  save(entity: T, data: any): Promise<void>;
  delete(id: string): Promise<void>;
}

// type ModelOperations<M extends keyof Prisma.TypeMap['model']> = Prisma.TypeMap['model'][M]['operations'];
type PrismaModel = PrismaClient[ModelProps] & any;
type ModelProps = Prisma.TypeMap['meta']['modelProps'];
// type Client = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
// type ModelProps = Capitalize<Exclude<Extract<keyof PrismaClient, string>, `$${string}`>>;

export abstract class BaseRepository<Result> {
  protected model: PrismaModel;
  constructor(
    private readonly db: PrismaService,
    private readonly modelKey: ModelProps,
  ) {
    this.model = this.db[this.modelKey];
  }

  async saveEntity(data: any): Promise<Result> {
    try {
      return await this.model.create({ data });
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to save entity: ${error}`);
    }
  }

  async getById(id: string): Promise<Result | null> {
    try {
      return await this.model.findUnique({ where: { id } });
    } catch (error) {
      console.error(`Failed to get entity: ${error}`);
      return null;
    }
  }

  async getAll(): Promise<Result | null> {
    try {
      return await this.model.findMany();
    } catch (error) {
      console.error(`Failed to get entities: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<Result> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update entity: ${error}`);
    }
  }

  async delete(id: string): Promise<Result> {
    try {
      return await this.model.delete({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to delete entity: ${error}`);
    }
  }

  // protected initTransaction(tx: PrismaTransactionClient) {
  //   this.db.useTransaction(tx);
  //   this.model = this.db.client;
  // }
  // protected endTransaction() {
  //   this.db.resetTransaction();
  //   this.model = this.db.client[this.modelKey];
  // }
}
