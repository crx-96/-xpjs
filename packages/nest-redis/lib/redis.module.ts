import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Provider,
  Scope,
  Type,
} from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

export const RedisService = Redis;

export class RedisModule {
  static register(options: RedisOptions, name?: InjectionToken): DynamicModule {
    return {
      module: RedisModule,
      exports: [!name ? RedisService : name],
      global: true,
      providers: [
        {
          provide: !name ? RedisService : name,
          useFactory: () => {
            return new RedisService(options);
          },
          scope: Scope.DEFAULT,
        },
      ],
    };
  }

  static registerAsync(options: {
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useFactory: (...args: any[]) => RedisOptions | Promise<RedisOptions>;
    providers?: Provider<any>[];
    imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
    name?: InjectionToken;
  }): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        ...(options.providers || []),
        {
          provide: options.name ? options.name : RedisService,
          useFactory: async (...args: any[]) => {
            return new RedisService(await options.useFactory(...args));
          },
          inject: [...(options.inject || [])],
          scope: Scope.DEFAULT,
        },
      ],
      imports: [...(options.imports || [])],
      exports: [options.name ? options.name : RedisService],
      global: true,
    };
  }
}
