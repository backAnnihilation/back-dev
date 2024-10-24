// import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
// import { CronJob } from 'cron';
// import { Injectable } from '@nestjs/common';



// @Injectable()
// export class OutboxService extends SchedulerService {
//   public command = OUTBOX_FILE;
//   constructor(
//     scheduleRegistry: SchedulerRegistry,
//     private outboxRepo: OutboxRepository,
//     private rmqAdapter: RmqAdapter,
//   ) {
//     super(scheduleRegistry);
//   }

//   async checkNonApprovedEvents() {
//     const nonApprovedEvents = await this.outboxRepo.getNonApprovedEvents();
//     console.log({ nonApprovedEvents });

//     if (nonApprovedEvents.length) {
//       await this.processNonApprovedEvents(nonApprovedEvents);
//     }
//   }

//   private async retrySendingEvent(event: any) {
//     return this.rmqAdapter.sendMessage(event.eventType, event);
//   }

//   private async sendFailedEventAlertToManager() {}

//   private async processNonApprovedEvents(events: OutboxDocument[]) {
//     for (const event of events) {
//       event.retryCount++;
//       event.retryCount === 4 && event.setStatus(EventStatus.FAILED);
//       if (event.status === EventStatus.FAILED) {
//         this.sendFailedEventAlertToManager();
//       }

//       await this.retrySendingEvent(event);
//       await this.outboxRepo.save(event);
//     }
//     await this.deleteFailedEvents();
//   }

//   private async deleteFailedEvents() {
//     await this.outboxRepo.deleteFailedEvents();
//   }

//   initJob(jobInfo: JobInfo) {
//     const { name, time, end, start, cb } = jobInfo;
//     const callback = cb || this.checkNonApprovedEvents.bind(this);
//     if (start) {
//       this.setInterval(name, start, end, callback);
//       return;
//     }
//     this.addJob(name, time, callback);
//   }
// }

// type JobInfo = {
//   name: string;
//   time?: CronExpression | string;
//   start?: number;
//   end?: number;
//   cb?: () => Promise<void>;
// };
