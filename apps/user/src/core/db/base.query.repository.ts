export interface BaseQueryRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
}

export class BaseQueryRepository<T> implements BaseQueryRepository<T> {
  async getAll(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  async getById(id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
