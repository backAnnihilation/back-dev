import { EventType } from '@app/shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export type OutboxDocument = HydratedDocument<OutboxEntity>;
export type OutboxModel = Model<OutboxDocument> & StaticMethodType;
type OutboxDto = {
  eventType: EventType;
  imageId: string;
};

export enum EventStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  AWAITING_DELIVERY = 'AWAITING_DELIVERY',
  DELIVERED = 'DELIVERED',
  RETRYING = 'RETRYING',
}

@Schema({ timestamps: true })
export class OutboxEntity {
  @Prop({ required: true, enum: EventStatus, default: EventStatus.PENDING })
  status: EventStatus;

  @Prop({ required: true, type: String })
  imageId: string;

  @Prop({ type: Object })
  payload: Record<string, any>;

  @Prop({ required: true, type: String })
  eventType: EventType;

  @Prop({ default: 0 })
  retryCount: number;

  createdAt: Date;
  updatedAt: Date;

  static makeInstance(dto: OutboxDto) {
    const outbox = new this() as OutboxDocument;
    Object.assign(outbox, dto);
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
