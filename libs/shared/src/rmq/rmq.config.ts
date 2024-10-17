import { registerAs } from '@nestjs/config';

export type RmqConfigType = { rmq: ReturnType<typeof rmqConfig> };
export const rmqConfig = registerAs('rmq', () => ({
  url: process.env.RMQ_URL,
  localUrl: process.env.RMQ_LOCAL_URL,
  filesQueue: process.env.RMQ_FILES_QUEUE,
}));
