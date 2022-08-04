import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Provider,
  Scope,
  Type,
} from '@nestjs/common';
import Redis, { Cluster, ClusterNode, ClusterOptions, RedisOptions } from 'ioredis';

export const RedisService = Redis;
export type RedisService = Redis;
export const ClusterService = Cluster;
export type ClusterService = Cluster;

export class RedisModule {
  static register(options: RedisOptions, name?: InjectionToken): DynamicModule {
    return {
      module: RedisModule,
      exports: [!name ? Redis : name],
      global: true,
      providers: [
        {
          provide: !name ? Redis : name,
          useFactory: () => {
            return new Redis(options);
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
          provide: options.name ? options.name : Redis,
          useFactory: async (...args: any[]) => {
            return new Redis(await options.useFactory(...args));
          },
          inject: [...(options.inject || [])],
          scope: Scope.DEFAULT,
        },
      ],
      imports: [...(options.imports || [])],
      exports: [options.name ? options.name : Redis],
      global: true,
    };
  }

  static registerCluster(nodes: ClusterNode[], options?: ClusterOptions, name?: InjectionToken): DynamicModule {
    return {
      module: RedisModule,
      exports: [!name ? Cluster : name],
      global: true,
      providers: [
        {
          provide: !name ? Cluster : name,
          useFactory: () => {
            return new Cluster(nodes, options);
          },
          scope: Scope.DEFAULT,
        },
      ],
    };
  }

  static registerClusterAsync(options: {
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useFactory: (...args: any[]) => [ClusterNode[], ClusterOptions?] | Promise<[ClusterNode[], ClusterOptions?]>;
    providers?: Provider<any>[];
    imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
    name?: InjectionToken;
  }): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        ...(options.providers || []),
        {
          provide: options.name ? options.name : Cluster,
          useFactory: async (...args: any[]) => {
            const [nodes, option] = await options.useFactory(...args);
            return new Cluster(nodes, option);
          },
          inject: [...(options.inject || [])],
          scope: Scope.DEFAULT,
        },
      ],
      imports: [...(options.imports || [])],
      exports: [options.name ? options.name : Cluster],
      global: true,
    };
  }
}
