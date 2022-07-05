import { Configuration, Inject } from '@midwayjs/decorator';
import * as DefaultConfig from './config/config.default';
import { MidwayDecoratorService } from '@midwayjs/core';
import {
  CUSTOM_BODY_DECORATOR,
  CUSTOM_PARAM_DECORATOR,
  CUSTOM_QUERY_DECORATOR,
  CUSTOM_VALIDATE_DECORATOR,
} from './decorator/http.decorator';
import {
  HttpDecoratorHandle,
  ValidateDecoratorHandle,
} from './handle/httpDecorator.handle';

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
    this.decoratorService.registerParameterHandler(
      CUSTOM_BODY_DECORATOR,
      HttpDecoratorHandle('body')
    );
    this.decoratorService.registerParameterHandler(
      CUSTOM_PARAM_DECORATOR,
      HttpDecoratorHandle('param')
    );
    this.decoratorService.registerParameterHandler(
      CUSTOM_QUERY_DECORATOR,
      HttpDecoratorHandle('query')
    );
    this.decoratorService.registerMethodHandler(
      CUSTOM_VALIDATE_DECORATOR,
      ValidateDecoratorHandle
    );
  }
}
