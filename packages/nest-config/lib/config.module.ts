import { DynamicModule, Scope } from '@nestjs/common';
import { isObject } from '@xpjs/common';
import { AsyncConfigOptions, AsyncOptions, ConfigOptions, RecordBackType } from './config.interface';
import { ConfigService } from './config.service';

export class ConfigModule {
  static register(options?: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigService,
          useFactory: () => {
            return new ConfigService(options);
          },
          scope: Scope.DEFAULT,
        },
      ],
      exports: [ConfigService],
      global: true,
    };
  }

  static registerAsync(handle: AsyncConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        ...(isObject(handle) ? (handle as AsyncOptions).providers || [] : []),
        {
          provide: ConfigService,
          useFactory: async (...args: any[]) => {
            let config = {};
            if (isObject(handle)) {
              config = await (handle as AsyncOptions).useFactory(...args);
            } else {
              config = await (handle as RecordBackType)();
            }
            const service = new ConfigService();
            service.set(config);
            return service;
          },
          inject: [...(isObject(handle) ? (handle as AsyncOptions).inject || [] : [])],
          scope: Scope.DEFAULT,
        },
      ],
      imports: [...(isObject(handle) ? (handle as AsyncOptions).imports || [] : [])],
      exports: [ConfigService],
      global: true,
    };
  }
}
