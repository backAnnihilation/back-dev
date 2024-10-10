import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

type SetIntervalOptions = {
  start: number;
  end?: number | null;
  cb: () => Promise<void>;
  name: string;
  deleteOnEnd?: boolean;
  delay?: number | null;
};

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
    const { job } = this.getJob(name);
    if (job) return;
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

  protected deleteIntervalJob(jobName: string) {
    this.scheduleRegistry.deleteInterval(jobName);
  }

  protected setInterval(options: SetIntervalOptions) {
    const { start, end, cb, name, delay, deleteOnEnd } = options;
    const { job } = this.getJob(name);
    if (job) return;

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
