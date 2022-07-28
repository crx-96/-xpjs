import { LogModule } from '../lib';
import { Test } from '@nestjs/testing';
import { LogService } from '../lib';

describe('测试日志模块', () => {
  describe('测试控制台打印', () => {
    let logger: LogService;

    beforeEach(async () => {
      const ref = await Test.createTestingModule({
        imports: [
          LogModule.register({
            appenders: {
              out: { type: 'console' },
            },
            categories: {
              default: {
                appenders: ['out'],
                level: 'all',
              },
            },
          }),
        ],
      }).compile();

      logger = ref.get(LogService);
    });

    it('开始测试 -- -- ', () => {
      logger.log('log');
      logger.warn('warn');
      logger.error('error');
      expect(1).toBe(1);
    });
  });
});
