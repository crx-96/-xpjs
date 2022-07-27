import { resolve } from 'path';
import * as winston from 'winston';

describe('测试winston的使用', () => {
  describe('测试颜色日志 - 控制台打印', () => {
    let logger: winston.Logger;

    beforeEach(() => {
      logger = winston.createLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.splat(),
          winston.format.simple(),
        ),
      });
    });

    it('测试', () => {
      logger.log('info', 'This is an information message.');
      logger.log('info', 'Hello, this is a raw logging event', { foo: 'bar' });
      logger.log('info', 'Hello, this is a raw logging event 2', { foo: 'bar' });
      expect(1).toBe(1);
    });
  });

  describe('文件日志打印', () => {
    let logger: winston.Logger;

    beforeEach(() => {
      logger = winston.createLogger({
        transports: [
          new winston.transports.Console({ format: winston.format.colorize({ all: true }) }),
          new winston.transports.File({ dirname: resolve(__dirname, '../logs'), filename: 'file1.log' }),
        ],
        format: winston.format.combine(winston.format.simple()),
      });
    });

    it('测试', () => {
      logger.log('info', 'This is an information message.');
      logger.log('info', 'Hello, this is a raw logging event', { foo: 'bar' });
      logger.log('info', 'Hello, this is a raw logging event 2', { foo: 'bar' });
      expect(1).toBe(1);
    });
  });

  describe('自定义日志等级与颜色 - 控制台', () => {
    let logger: winston.Logger & Partial<Record<string, any>>;
    const config = {
      levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
        custom: 7,
      },
      colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'grey',
        info: 'green',
        verbose: 'cyan',
        silly: 'magenta',
        custom: 'yellow',
      },
    };

    beforeEach(() => {
      winston.addColors(config.colors);
      logger = winston.createLogger({
        levels: config.levels,
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        transports: [new winston.transports.Console()],
        level: 'custom',
      });
    });

    it('测试', () => {
      logger.custom('hello');
      logger.info('hello');
      logger.error('hello');
      expect(1).toBe(1);
    });
  });

  describe('时间日志 - 控制台', () => {
    let logger: winston.Logger;

    beforeEach(() => {
      logger = winston.createLogger({
        format: winston.format.combine(
          winston.format.label({ label: '[my-label]', message: true }),
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.printf(({ message, timestamp, level, ...info }) => {
            return `${level}：${timestamp} \n ${JSON.stringify(info)} \n ${message}`;
          }),
        ),
        transports: [new winston.transports.Console({})],
      });
    });

    it('测试', () => {
      logger.log('info', 'This is an information message.');
      logger.log('info', 'Hello, this is a raw logging event', { foo: 'bar' });
      logger.log('info', 'Hello, this is a raw logging event 2', { foo: 'bar' });
      expect(1).toBe(1);
    });
  });
});
