import { Redis, RedisService, RedisOptions } from '../lib';

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
});
