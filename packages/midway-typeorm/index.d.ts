export * from './dist/index';
export { DataSourceOptions } from './dist/index';

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    typeorm?: PowerPartial<{
      default?: DataSourceOptions;
      [index: string]: DataSourceOptions;
    }>;
  }
}
