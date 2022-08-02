import { DynamicModule } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
export class RedisModule {
  static registerRedis(options: RedisOptions): DynamicModule {
    return {
      module: RedisModule,
    };
  }
}
