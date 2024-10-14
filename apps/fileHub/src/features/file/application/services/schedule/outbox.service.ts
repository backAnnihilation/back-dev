import { Injectable } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import {
  EVENT_COMMANDS,
  OUTBOX_FILE,
  PROFILE_IMAGES_PROCESSED,
  SchedulerService,
} from '@app/shared';
import { OutboxRepository } from '../../../infrastructure/events.outbox.repository';
import { RmqAdapter } from '@file/core/adapters/rmq.adapter';
import {
  EventStatus,
  OutboxDocument,
} from '../../../domain/entities/outbox.schema';
import { ProcessedProfileImagesEvent } from '../../../api/models/dto/processed-profile-images-event';

@Injectable()
export class OutboxService extends SchedulerService {
  public command = OUTBOX_FILE;
  constructor(
    scheduleRegistry: SchedulerRegistry,
    private outboxRepo: OutboxRepository,
    private rmqAdapter: RmqAdapter,
  ) {
    super(scheduleRegistry);
  }

  async checkNonApprovedEvents(entityId: string, jobName: string) {
    // const nonApprovedEvents = await this.outboxRepo.getNonApprovedEvents();
    const nonApprovedEvent =
      await this.outboxRepo.getNonApprovedEventById(entityId);
    console.log({ nonApprovedEvent });

    if (nonApprovedEvent) {
      await this.processNonApprovedEvents(nonApprovedEvent);
    } else {
      this.deleteIntervalJob(jobName);
    }
  }

  private async retrySendingEvent(eventRaw: OutboxDocument) {
    const event = new ProcessedProfileImagesEvent(eventRaw);
    return this.rmqAdapter.sendMessage(PROFILE_IMAGES_PROCESSED, event);
  }

  private async sendFailedEventAlertToManager() {}

  private async processNonApprovedEvents(...events: OutboxDocument[]) {
    for (const event of events) {
      event.retryCount++;
      event.retryCount === 3 && event.setStatus(EventStatus.FAILED);
      if (event.status === EventStatus.FAILED) {
        this.sendFailedEventAlertToManager();
      }
      await this.retrySendingEvent(event);
      await this.outboxRepo.save(event);
    }
    // await this.deleteFailedEvents();
  }

  private async deleteFailedEvents() {
    await this.outboxRepo.deleteFailedEvents();
  }

  initIntervalJob(jobInfo: JobInfo) {
    const { name, time, end, start } = jobInfo;
    const cb = this.checkNonApprovedEvents.bind(this, jobInfo.entityId, name);
    this.setInterval({ name, start, end, cb });
    return;
  }
}

type JobInfo = {
  name: string;
  entityId: string;
  time?: CronExpression | string;
  start?: number;
  end?: number;
  cb?: () => Promise<void>;
};
