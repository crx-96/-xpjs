import { Configuration } from '@midwayjs/decorator';
import * as DefaultConfig from './config/config.default';
import { IMidwayApplication, IMidwayContainer } from '@midwayjs/core';
import { initTypeorm } from './handle/init.handle';

@Configuration({
  namespace: 'midway-typeorm',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class TypeormConfiguration {
  async onReady(container: IMidwayContainer, app: IMidwayApplication) {
    // 初始化typeorm
    initTypeorm(app.getConfig('typeorm') || {});
  }
}
