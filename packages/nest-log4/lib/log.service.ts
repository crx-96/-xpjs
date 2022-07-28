import { LoggerService, LogLevel } from '@nestjs/common';
import { Configuration, configure, getLogger as getLoggerTemp, Logger } from 'log4js';

export class LogService implements LoggerService {
  private readonly logger: Logger;

  constructor(options: Configuration, category = 'default') {
    configure(options);
    this.logger = getLoggerTemp(category);
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
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
    this.logger.trace(message, ...optionalParams);
  }
  setLogLevels?(levels: LogLevel[]) {
    this.logger.log('ALL', levels);
  }

  getLogger(category = 'default'): Logger {
    return getLoggerTemp(category);
  }
}
