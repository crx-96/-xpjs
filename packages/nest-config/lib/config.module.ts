import { DynamicModule, Scope } from '@nestjs/common';
import { ConfigOptions } from './config.interface';
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

  static registerAsync(handle: () => Promise<Record<string, any>>): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigService,
          useFactory: async () => {
            const config = await handle();
            const service = new ConfigService();
            service.set(config);
            return service;
          },
          scope: Scope.DEFAULT,
        },
      ],
      exports: [ConfigService],
      global: true,
    };
  }
}
