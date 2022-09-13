import { Logger } from '../lib';
import { Test } from '@nestjs/testing';

class CustomLogger extends Logger {
    public constructor(options?: any) {
        super(options);
    }

    public info(message: string): this;
    public info(message: string, meta: any): this;
    public info(message: string, ...meta: any[]): this;
    public info(message: any): this;
    public info(infoObject: object): this;
    public info(message: any, ...args: any[]): this {
        super.info(message, ...args);
        console.log('我是自定义的');
        return this;
    }
}

describe('测试日志', () => {
    describe('测试日志多个日志模块', () => {
        let log1: Logger;
        let log2: Logger;
        let log3: Logger;
        let log4: Logger;

        beforeEach(async () => {
            const ref = await Test.createTestingModule({
                imports: [
                    Logger.register(),
                    Logger.register({ name: 'test1' }),
                    Logger.registerAsync(
                        {
                            useFactory: () => {
                                return { name: 'test2' };
                            },
                        },
                        'test2',
                    ),
                    Logger.registerAsync(
                        {
                            useFactory: () => {
                                return { name: 'test3' };
                            },
                        },
                        'test3',
                    ),
                ],
            }).compile();
            log1 = ref.get(Logger);
            log2 = ref.get('test1');
            log3 = ref.get('test2');
            log4 = ref.get('test3');
        });

        it('测试日志多个日志模块', () => {
            log1.error('Logger');
            log2.error('test1');
            log3.error('test2');
            log4.error('test3');
            expect(1).toBe(1);
        });
    });

    describe('测试自定义日志', () => {
        let logger: CustomLogger;

        beforeEach(async () => {
            const ref = await Test.createTestingModule({
                imports: [Logger.register({ logger: CustomLogger })],
            }).compile();
            logger = ref.get(Logger);
        });

        it('测试自定义日志', () => {
            logger.info('测试自定义日志');
            expect(1).toBe(1);
        });
    });

    describe('测试控制套打印日志', () => {
        let logger: Logger;

        beforeEach(async () => {
            const ref = await Test.createTestingModule({
                imports: [
                    Logger.register({
                        level: 'debug',
                        transports: [
                            {
                                type: 'console',
                                level: 'info',
                                format: {
                                    printf: ({ timestamp, message }) =>
                                        `[==========${timestamp}==========]：\n${message}`,
                                    colorize: { all: true },
                                },
                            },
                        ],
                    }),
                ],
            }).compile();
            logger = ref.get(Logger);
        });

        it('测试控制套打印日志', () => {
            logger.debug('debug');
            logger.info('info');
            logger.warn('warn');
            logger.error('error');
            expect(1).toBe(1);
        });
    });
});
