import { LogModule } from '../lib';
import { Test } from '@nestjs/testing';
import { LogService } from '../lib';
import { resolve } from 'path';

describe('测试日志模块', () => {
  describe('测试', () => {
    let logger: LogService;

    beforeEach(async () => {
      const ref = await Test.createTestingModule({
        imports: [
          LogModule.register({
            appenders: {
              out: { type: 'stdout' },
              file: {
                type: 'dateFile',
                filename: resolve(__dirname, '../logs', 'warn.log'),
                alwaysIncludePattern: true,
                keepFileExt: true,
                daysToKeep: 0,
                enableCallStack: true,
              },
              file2: {
                type: 'dateFile',
                filename: resolve(__dirname, '../logs', 'info.log'),
                alwaysIncludePattern: true,
                keepFileExt: true,
                daysToKeep: 0,
                enableCallStack: true,
              },
            },
            categories: {
              default: {
                appenders: ['out'],
                level: 'warn',
              },
              file: {
                appenders: ['file', 'file2'],
                level: 'info',
              },
            },
          }),
        ],
      }).compile();

      logger = ref.get(LogService);
    });

    it('开始测试 -- -- 控制台', () => {
      logger.log('log');
      logger.warn('warn');
      logger.error('error');
      expect(1).toBe(1);
    });

    it('开始测试 -- -- 文件', () => {
      logger.getLogger('file').warn(String(Date.now()));
      logger.getLogger('file').info(String(Date.now()));
      expect(1).toBe(1);
    });
  });
});
