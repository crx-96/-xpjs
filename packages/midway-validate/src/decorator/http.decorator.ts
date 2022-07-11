import {
  createCustomMethodDecorator,
  createCustomParamDecorator,
} from '@midwayjs/decorator';
import { ClassConstructor } from 'class-transformer';

/**
 * 自定义body装饰器
 */
export const CUSTOM_BODY_DECORATOR = 'decorator:custom_body';
export function Body(
  key?: string,
  type?: ClassConstructor<any>
): ParameterDecorator {
  return createCustomParamDecorator(CUSTOM_BODY_DECORATOR, { key, type });
}

/**
 * 自定义query装饰器
 */
export const CUSTOM_QUERY_DECORATOR = 'decorator:custom_query';
export function Query(
  key?: string,
  type?: ClassConstructor<any>
): ParameterDecorator {
  return createCustomParamDecorator(CUSTOM_QUERY_DECORATOR, { key, type });
}

/**
 * 自定义param装饰器
 */
export const CUSTOM_PARAM_DECORATOR = 'decorator:custom_param';
export function Param(
  key?: string,
  type?: ClassConstructor<any>
): ParameterDecorator {
  return createCustomParamDecorator(CUSTOM_PARAM_DECORATOR, { key, type });
}

/**
 * 自定义Validate装饰器
 */
export const CUSTOM_VALIDATE_DECORATOR = 'decorator:custom_validate';
export function Validate(): MethodDecorator {
  return createCustomMethodDecorator(CUSTOM_VALIDATE_DECORATOR, {});
}
