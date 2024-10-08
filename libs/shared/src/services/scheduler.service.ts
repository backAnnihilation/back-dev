import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

export class SchedulerService {
  constructor(protected scheduleRegistry: SchedulerRegistry) {}

  protected addJob(
    jobName: string,
    cronTime: CronExpression | string,
    cb: () => Promise<void>,
  ) {
    const { job } = this.getJob(jobName);

    if (!job) {
      const job = new CronJob(cronTime, async () => {
        await cb();
      });

      this.scheduleRegistry.addCronJob(jobName, job);
      job.start();
    }
  }
  protected addTimeout(name: string, time: number, cb: () => void) {
    const timeoutId = setTimeout(cb, time);
    this.scheduleRegistry.addTimeout(name, timeoutId);
  }

  protected deleteTimeout(name: string) {
    const timeout = this.scheduleRegistry.getTimeout(name);
    if (timeout) {
      clearTimeout(timeout);
      this.scheduleRegistry.deleteTimeout(name);
    }
  }


  protected deleteJob(jobName: string) {
    const { job } = this.getJob(jobName);
    if (job) {
      job.stop();
      this.scheduleRegistry.deleteCronJob(jobName);
    }
  }

  private deleteIntervalJob(jobName: string) {
    this.scheduleRegistry.deleteInterval(jobName);
  }

  protected setInterval(
    name: string,
    start: number,
    end: number | null = null,
    cb: () => Promise<void>,
  ) {
    const intervalId = setInterval(async () => {
      await cb();
    }, start);
    this.scheduleRegistry.addInterval(name, intervalId);

    if (end) {
      setTimeout(() => {
        clearInterval(intervalId);
        this.deleteIntervalJob(name);
      }, end);
    }
  }

  private getJob(jobName: string) {
    try {
      const job = this.scheduleRegistry.getCronJob(jobName);
      return { job, jobName };
    } catch (error) {
      return { jobName, job: null };
    }
  }
}

export enum JobName {
  BucketMaintenance = 'bucket-maintenance',
  OutboxEvents = 'outbox-events',
}
