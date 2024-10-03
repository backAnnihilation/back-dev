import { Injectable } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { OUTBOX_FILE, SchedulerService } from '@app/shared';
import { OutboxRepository } from '../../../infrastructure/events.outbox.repository';
import { RmqAdapter } from '@file/core/adapters/rmq.adapter';
import {
  EventStatus,
  OutboxDocument,
} from '../../../domain/entities/outbox.schema';

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

  async checkNonApprovedEvents() {
    const nonApprovedEvents = await this.outboxRepo.getNonApprovedEvents();
    console.log({ nonApprovedEvents });

    if (nonApprovedEvents.length) {
      await this.processNonApprovedEvents(nonApprovedEvents);
    }
  }

  private async retrySendingEvent(event: any) {
    return this.rmqAdapter.sendMessage(event.eventType, event);
  }

  private async processNonApprovedEvents(events: OutboxDocument[]) {
    for (const event of events) {
      event.retryCount++;
      event.retryCount === 4 && event.setStatus(EventStatus.FAILED);

      await this.retrySendingEvent(event);
      await this.outboxRepo.save(event);
    }
    await this.deleteFailedEvents();
  }

  private async deleteFailedEvents() {
    await this.outboxRepo.deleteFailedEvents();
  }

  initJob(jobInfo: JobInfo) {
    const { name, time, end, start, cb } = jobInfo;
    const callback = cb || this.checkNonApprovedEvents.bind(this);
    if (start) {
      this.setInterval(name, start, end, callback);
      return;
    }
    this.addJob(name, time, callback);
  }
}

type JobInfo = {
  name: string;
  time?: CronExpression | string;
  start?: number;
  end?: number;
  cb?: () => Promise<void>;
};
