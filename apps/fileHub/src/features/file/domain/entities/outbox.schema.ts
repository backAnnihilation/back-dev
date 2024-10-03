import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EVENT_COMMANDS, EventType } from '@app/shared';
import { HydratedDocument, Model, set } from 'mongoose';

export type OutboxDocument = HydratedDocument<OutboxEntity>;
export type OutboxModel = Model<OutboxDocument> & StaticMethodType;

export enum EventStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  AWAITING_DELIVERY = 'AWAITING_DELIVERY',
  DELIVERED = 'DELIVERED',
  RETRYING = 'RETRYING',
}

@Schema({ timestamps: true })
export class OutboxEntity {
  @Prop({ required: true, enum: EventStatus })
  status: EventStatus;

  @Prop({ type: Object })
  payload: Record<string, any>;

  @Prop({ required: true, type: String })
  eventType: EventType | EVENT_COMMANDS;

  @Prop({ default: 0 })
  retryCount: number;

  static makeInstance(outboxDto: Partial<OutboxEntity>) {
    const outbox = new this() as OutboxDocument;
    outbox.status = EventStatus.PENDING;
    outbox.eventType = outboxDto.eventType;
    return outbox;
  }

  update(status: EventStatus, payload: Record<string, any>) {
    this.status = status;
    this.payload = payload;
  }
  approveDelivery() {
    this.status = EventStatus.DELIVERED;
  }
  setStatus(status: EventStatus) {
    this.status = status;
  }
}

export const OutboxSchema = SchemaFactory.createForClass(OutboxEntity);

const OutboxStatics = {
  makeInstance: OutboxEntity.makeInstance,
};
const OutboxMethods = {
  update: OutboxEntity.prototype.update,
  approveDelivery: OutboxEntity.prototype.approveDelivery,
  setStatus: OutboxEntity.prototype.setStatus,
};

type StaticMethodType = typeof OutboxStatics;
OutboxSchema.statics = OutboxStatics;
OutboxSchema.methods = OutboxMethods;
