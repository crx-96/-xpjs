import { createCustomMethodDecorator } from '@midwayjs/decorator';
import { ClassConstructor } from 'class-transformer';

export interface ValidateOptions {
  type?: ClassConstructor<any>;
}

/**
 * 自定义Validate装饰器
 */
export const CUSTOM_VALIDATE_DECORATOR = 'decorator:custom_validate';
export function Validate(options?: ValidateOptions): MethodDecorator {
  return createCustomMethodDecorator(CUSTOM_VALIDATE_DECORATOR, options || {});
}
