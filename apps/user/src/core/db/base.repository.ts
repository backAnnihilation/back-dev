import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
import { PrismaTransactionClient } from '../application/use-cases/base-use-case';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DefaultArgs } from '@prisma/client/runtime/library';

export interface IBaseRepository<T> {
  getById(id: string): Promise<T>;
  save(entity: T, data: any): Promise<void>;
  delete(id: string): Promise<void>;
}

// type ModelOperations<M extends keyof Prisma.TypeMap['model']> = Prisma.TypeMap['model'][M]['operations'];
// type Client = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
// type Models = Capitalize<Exclude<Extract<keyof PrismaClient, string>, `$${string}`>>;
type PrismaModel = PrismaClient[ModelProps] & any;
type ModelProps = Prisma.TypeMap['meta']['modelProps'];

export abstract class BaseRepository<RModel> {
  protected model: PrismaModel;
  constructor(
    private readonly db: PrismaService,
    private readonly modelKey: ModelProps,
    protected readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {
    this.model = this.db[this.modelKey];
  }

  async save(data: any): Promise<RModel> {
    try {
      return await this.getRepository.create({ data });
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to save entity: ${error}`);
    }
  }

  async getById(id: string, uniq: boolean = true): Promise<RModel | null> {
    let result: RModel;
    try {
      if (uniq) {
        result = await this.getRepository.findUnique({ where: { id } });
      } else {
        result = await this.getRepository.findFirst({ where: { id } });
      }
      return result;
    } catch (error) {
      console.error(`Failed to get entity: ${error}`);
      return null;
    }
  }

  async getAll(): Promise<RModel | null> {
    try {
      return await this.getRepository.findMany();
    } catch (error) {
      console.error(`Failed to get entities: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<RModel> {
    try {
      return await this.getRepository.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.log('fail to update entity', error);
      throw new Error(`Failed to update entity: ${error}`);
    }
  }

  async delete(id: string): Promise<RModel> {
    try {
      return await this.getRepository.delete({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to delete entity: ${error}`);
    }
  }

  protected get getRepository(): PrismaModel {
    const isTxActive = this.txHost?.isTransactionActive();
    return (isTxActive && this.txHost.tx[this.modelKey]) || this.model;
  }
}
