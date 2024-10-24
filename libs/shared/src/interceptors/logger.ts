import { LoggerService } from '@nestjs/common';

export const COLORS = {
  info: '\x1b[1;37m',
  debug: '\x1b[1;33m',
  error: '\x1b[0;31m',
  system: '\x1b[1;34m',
  access: '\x1b[1;38m',
  success: '\x1b[0;32m', // green
  warning: '\x1b[0;33m', // yellow
  critical: '\x1b[1;31m', // bright red
  notice: '\x1b[0;36m', // aqua
  alert: '\x1b[1;35m', // purple
  emergency: '\x1b[0;41m', // red
  primary: '\x1b[0;34m', // blue
  secondary: '\x1b[0;35m', // pink
  tertiary: '\x1b[0;36m', // blue
  muted: '\x1b[0;37m', // grey
  highlighted: '\x1b[0;43m', // yellow
  inverse: '\x1b[0;7m', // white background; black text
  reset: '\x1b[0m',
};

export class CustomLogger implements LoggerService {
  log(message: string) {
    console.log(`${COLORS.alert}${message}`);
  }

  error(message: string, trace: string) {
    console.error(`${COLORS.emergency}${message}`);
    console.error(`${COLORS.emergency}${trace}`);
  }

  warn(message: string) {
    console.warn(`${COLORS.warning}${message}`);
  }

  debug(message: string) {
    console.debug(`${COLORS.tertiary}${message}`);
  }

  verbose(message: string) {
    console.log(`${COLORS.muted}${message}`);
  }
}
