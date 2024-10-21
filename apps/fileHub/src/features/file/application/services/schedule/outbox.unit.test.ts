import { SchedulerRegistry } from '@nestjs/schedule';
import { RmqAdapter } from '../../../../../core/adapters/rmq.adapter';
import { OutboxRepository } from '../../../infrastructure/events.outbox.repository';
import { OutboxService } from './outbox.service';
import { TelegramService } from '@app/shared';

const wait = (sec: number) =>
  new Promise((resolve) => setTimeout(resolve, sec * 1000));

jest.useFakeTimers();

describe('SchedulerService', () => {
  let schedulerRegistry: SchedulerRegistry;
  let outboxService: OutboxService;
  let outboxRepo: OutboxRepository;
  let rmqAdapter: RmqAdapter;
  let telegramService: TelegramService;

  beforeEach(() => {
    schedulerRegistry = new SchedulerRegistry();
    outboxRepo = {
      getNonApprovedEvents: jest.fn().mockResolvedValue([]),
    } as unknown as OutboxRepository;
    rmqAdapter = {
      sendMessage: jest.fn(),
    } as unknown as RmqAdapter;
    telegramService = {
      sendMessageToMultipleUsers: jest.fn(),
    } as unknown as TelegramService;

    outboxService = new OutboxService(
      schedulerRegistry,
      outboxRepo,
      rmqAdapter,
      telegramService,
    );
  });

  describe('initIntervalJob', () => {
    it('should add a new job', async () => {
      const jobName = 'testJob';
      const cb = jest.fn();

      outboxService.initIntervalJob({
        name: jobName,
        start: 1000,
        end: 5000,
        entityId: '123',
      });

      const job = schedulerRegistry.getInterval(jobName);
      expect(job).toBeDefined();
      expect(cb).not.toHaveBeenCalled();
    });

    it('should add new job', async () => {
      const jobName = 'newJob';
      const cronTime = '* * * * *';
      const cb = jest.fn();

      outboxService.initIntervalJob({
        name: jobName,
        time: cronTime,
        entityId: '123',
      });

      const job = schedulerRegistry.getCronJob(jobName);
      expect(job).toBeDefined();
      expect(cb).not.toHaveBeenCalled();
    });

    it.skip('should set an interval and call the callback periodically', async () => {
      const cb = jest.fn();
      const jobName = 'testInterval';
      const start = 1000;
      const end = 5000;

      outboxService.initIntervalJob({
        name: jobName,
        start,
        end,
        cb,
        entityId: '123',
      });

      //   jest.advanceTimersByTime(1000);
      //   expect(cb).toHaveBeenCalledTimes(1);

      //   jest.advanceTimersByTime(1000)
      //   expect(cb).toHaveBeenCalledTimes(2);

      await wait(5);
      //   jest.advanceTimersByTime(3000);
      //   expect(cb).toHaveBeenCalledTimes(5);

      //   jest.advanceTimersByTime(1000);
      expect(cb).toHaveBeenCalledTimes(5);

      // check job interval is deleted after end
      expect(schedulerRegistry.getInterval(jobName)).toBeUndefined();
    });
  });

  // describe('deleteJob', () => {
  //     it('should delete an existing job', async () => {
  //         const jobName = 'testJob';
  //         const cronTime = '* * * * *';
  //         const cb = jest.fn();

  //         outboxService.addJob(jobName, cronTime, cb);
  //         outboxService.deleteJob(jobName);

  //         const job = schedulerRegistry.getCronJob(jobName);
  //         expect(job).toBeUndefined();
  //     });

  //     it('should do nothing if job does not exist', async () => {
  //         const jobName = 'nonExistentJob';

  //         outboxService.deleteJob(jobName);
  //         expect(true).toBe(true);
  //     });
  // });

  // describe('initIntervalJob', () => {
  //     it('should initialize a job with interval', async () => {
  //         const jobInfo = { name: 'testIntervalJob', start: 1000, end: 5000 };
  //         jest.spyOn(outboxService, 'setInterval');

  //         outboxService.initIntervalJob(jobInfo);

  //         expect(outboxService.setInterval).toHaveBeenCalledWith(jobInfo.name, jobInfo.start, jobInfo.end, outboxService.checkNonApprovedEvents);
  //     });

  //     it('should initialize a job with cron time', async () => {
  //         const jobInfo = { name: 'testCronJob', time: '* * * * *' };
  //         jest.spyOn(outboxService, 'addJob');

  //         outboxService.initIntervalJob(jobInfo);

  //         expect(outboxService.addJob).toHaveBeenCalledWith(jobInfo.name, jobInfo.time, outboxService.checkNonApprovedEvents);
  //     });
  // });

  // describe('checkNonApprovedEvents', () => {
  //     it('should process non-approved events', async () => {
  //         const event = { eventType: 'testEvent' };
  //         outboxRepo.getNonApprovedEvents = jest.fn().mockResolvedValue([event]);

  //         await outboxService.checkNonApprovedEvents();

  //         expect(outboxRepo.getNonApprovedEvents).toHaveBeenCalled();
  //         expect(rmqAdapter.sendMessage).toHaveBeenCalledWith(event.eventType, event);
  //     });

  //     it('should not process events if none are found', async () => {
  //         outboxRepo.getNonApprovedEvents = jest.fn().mockResolvedValue([]);

  //         await outboxService.checkNonApprovedEvents();

  //         expect(outboxRepo.getNonApprovedEvents).toHaveBeenCalled();
  //         expect(rmqAdapter.sendMessage).not.toHaveBeenCalled();
  //     });
  // });
});
