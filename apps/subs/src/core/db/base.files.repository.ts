import { Document, Model } from 'mongoose';

import { OutputId } from '@app/shared';

export class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async save(fileDto: T): Promise<OutputId> {
    try {
      const result = await fileDto.save();
      return { id: result._id.toString(), ...result };
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
}
