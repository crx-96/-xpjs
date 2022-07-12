import { Configuration, Inject } from '@midwayjs/decorator';
import * as DefaultConfig from './config/config.default';
import { MidwayDecoratorService } from '@midwayjs/core';
import { CUSTOM_VALIDATE_DECORATOR } from './decorator/http.decorator';
import { ValidateDecoratorHandle } from './handle/validate.handle';

@Configuration({
  namespace: 'midway-validate',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class BookConfiguration {
  @Inject()
  decoratorService: MidwayDecoratorService;

  async onReady() {
    // 注册自定义装饰器
    this.decoratorService.registerMethodHandler(
      CUSTOM_VALIDATE_DECORATOR,
      ValidateDecoratorHandle
    );
  }
}
