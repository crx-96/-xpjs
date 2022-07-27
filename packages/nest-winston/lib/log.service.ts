import { LoggerService, LogLevel } from '@nestjs/common';
import { Logger, LoggerOptions, createLogger } from 'winston';

export class LogService implements LoggerService {
  // winston实例
  readonly logger: Logger;

  constructor(options?: LoggerOptions) {
    this.logger = createLogger(options);
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.log('info', message, ...optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, ...optionalParams);
  }
  setLogLevels?(levels: LogLevel[]) {
    const tt: { [key: string]: number } = {};
    levels.forEach((item, index) => {
      tt[item] = index;
    });
    this.logger.levels = tt;
  }
}
