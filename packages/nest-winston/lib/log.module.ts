import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Provider,
  Scope,
  Type,
} from '@nestjs/common';
import { LogService } from './log.service';
import { LoggerOptions } from 'winston';

export class LogModule {
  static register(options?: LoggerOptions): DynamicModule {
    return {
      module: LogModule,
      providers: [
        {
          provide: LogService,
          useFactory: () => {
            return new LogService(options);
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
    useFactory: (...args: any[]) => LoggerOptions | Promise<LoggerOptions>;
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
            let logOptions: LoggerOptions | undefined = undefined;
            if (options?.useFactory) {
              logOptions = await options.useFactory(...args);
            }
            return new LogService(logOptions);
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
