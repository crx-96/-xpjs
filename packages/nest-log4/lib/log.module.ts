import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Provider,
  Scope,
  Type,
} from '@nestjs/common';
import { Configuration } from 'log4js';
import { LogService } from './log.service';

export class LogModule {
  static register(options: Configuration, category?: string): DynamicModule {
    return {
      module: LogModule,
      providers: [
        {
          provide: LogService,
          useFactory: () => {
            return new LogService(options, category || 'default');
          },
          scope: Scope.DEFAULT,
        },
      ],
      exports: [LogService],
      global: true,
    };
  }

  static registerAsync(options?: {
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useFactory: (...args: any[]) => [Configuration, string?] | Promise<[Configuration, string?]>;
    providers?: Provider<any>[];
    imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
  }): DynamicModule {
    return {
      module: LogModule,
      providers: [
        ...(options?.providers || []),
        {
          provide: LogService,
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            return new LogService(config[0], config[1] || 'default');
          },
          inject: [...(options?.inject || [])],
          scope: Scope.DEFAULT,
        },
      ],
      imports: [...(options.imports || [])],
      exports: [LogService],
      global: true,
    };
  }
}
