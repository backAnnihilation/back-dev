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

  private getTimeout(name: string) {
    try {
      return this.scheduleRegistry.getTimeout(name);
    } catch (error) {
      return null;
    }
  }
  protected addTimeout(name: string, time: number, cb: () => void) {
    const timeOutJob = this.getTimeout(name);
    if (timeOutJob) return;
    const timeoutId = setTimeout(cb, time);
    this.scheduleRegistry.addTimeout(name, timeoutId);
  }

  protected deleteTimeout(name: string) {
    const timeout = this.getTimeout(name);
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
    try {
      this.scheduleRegistry.deleteInterval(jobName);
    } catch (error) {
      console.log('deleteIntervalJob', { error });
    }
  }

  private getInterval(name: string) {
    try {
      return this.scheduleRegistry.getInterval(name);
    } catch (error) {
      return null;
    }
  }
  protected setInterval(options: SetIntervalOptions) {
    const { start, end, cb, name, delay, deleteOnEnd } = options;

    const intervalJob = this.getInterval(name);
    if (intervalJob) return;

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
