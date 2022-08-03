import { Redis, RedisService, RedisOptions, RedisModule } from '../lib';
import { Test } from '@nestjs/testing';

const config: RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
  password: '123456',
  db: 0,
};

describe('测试redis的基本用法', () => {
  it('测试Redis与RedisService是否是同一个东西', () => {
    expect((Redis as any) === RedisService).toBe(true);
  });

  describe('测试多实例', () => {
    let redis;
    let redis2;
    let redis3;
    let redis4;

    beforeEach(async () => {
      const ref = await Test.createTestingModule({
        imports: [
          RedisModule.register(config),
          RedisModule.register(config, 'redis2'),
          RedisModule.registerAsync({
            useFactory: () => {
              return config;
            },
            name: 'redis3',
          }),
          RedisModule.registerAsync({
            useFactory: () => {
              return config;
            },
            name: 'redis4',
          }),
        ],
      }).compile();

      redis = ref.get(RedisService);
      redis2 = ref.get('redis2');
      redis3 = ref.get('redis3');
      redis4 = ref.get('redis4');
    });

    afterEach(async () => {
      await redis.disconnect();
      await redis2.disconnect();
      await redis3.disconnect();
      await redis4.disconnect();
    });

    it('测试', async () => {
      await redis.set('test', 'test');
      await redis2.set('test2', 'test2');
      await redis3.set('test3', 'test3');
      await redis4.set('test4', 'test4');
      expect(await redis.get('test')).toBe('test');
      expect(await redis.get('test2')).toBe('test2');
      expect(await redis.get('test3')).toBe('test3');
      expect(await redis.get('test4')).toBe('test4');
      expect(await redis.get('test5')).toBe(null);
      await redis.del('test', 'test2', 'test3', 'test4');
    });
  });
});
