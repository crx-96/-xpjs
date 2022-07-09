export * from './dist/index';
import { DataSourceOptions } from './dist/index';

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    typeorm?: PowerPartial<{
      default?: DataSourceOptions;
      [index: string]: DataSourceOptions;
    }>;
  }
}
