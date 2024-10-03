import { OutputId } from '@app/shared';
import { Document, Model } from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async save(fileDto: T): Promise<T> {
    try {
      return await fileDto.save();
    } catch (error) {
      console.error('Failed to save document');
      throw new Error(error);
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const result = await this.model.findById(id);
      return result || null;
    } catch (error) {
      console.error('Failed to get document by ID', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Failed to delete document', error);
      return false;
    }
  }

  async update(id: string, update: Partial<T>): Promise<T | null> {
    try {
      const result = await this.model.findByIdAndUpdate(id, update, {
        new: true,
      });
      return result || null;
    } catch (error) {
      console.error('Failed to update document', error);
      return null;
    }
  }
}
