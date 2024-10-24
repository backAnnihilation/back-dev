import { BaseRepository } from '@file/core/db/base.files.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EventStatus,
  OutboxDocument,
  OutboxEntity,
  OutboxModel,
} from '../domain/entities/outbox.schema';

@Injectable()
export class OutboxRepository extends BaseRepository<OutboxDocument> {
  constructor(@InjectModel(OutboxEntity.name) outboxModel: OutboxModel) {
    super(outboxModel);
  }

  async getNonApprovedEvents(): Promise<OutboxDocument[]> {
    try {
      return await this.model.find({
        status: EventStatus.AWAITING_DELIVERY,
      });
    } catch (error) {
      console.error('getNonApprovedEvents' + error);
    }
  }

  async getNonApprovedEventById(id: string) {
    try {
      return await this.model.findOne({
        _id: id,
        status: EventStatus.AWAITING_DELIVERY,
      });
    } catch (error) {
      return null;
    }
  }

  async getEventByImageId(imageId: string) {
    try {
      return await this.model.findOne({
        payload: { imageId },
      });
    } catch (error) {
      return null;
    }
  }

  async getFailedEvents(): Promise<OutboxDocument[]> {
    try {
      return await this.model.find({
        status: EventStatus.FAILED,
      });
    } catch (error) {
      console.error('getFailedEvents' + error);
    }
  }

  async deleteFailedEvents() {
    try {
      await this.model.deleteMany({ status: EventStatus.FAILED });
    } catch (error) {
      console.log('deleteFailedEvents' + error);
    }
  }
}
