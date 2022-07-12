import { ValidateOptions } from '../decorator/http.decorator';
import { getMethodParamTypes } from '@midwayjs/decorator';
import { isObject } from '@xpjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { BadRequestError } from '@midwayjs/core/dist/error/http';

/**
 * 自定义validate方法装饰器实现
 */
export const ValidateDecoratorHandle = options => {
  // 获取参数类型
  const paramTypes: any[] = getMethodParamTypes(
    options.target,
    options.propertyName
  );
  // 获取验证装饰器的参数
  const validateOptions: ValidateOptions = options.metadata;
  return {
    async around(joinPoint) {
      paramTypes.forEach((item, index) => {
        // 参数
        const param = joinPoint.args[index];
        // 只处理对象类型的数据，其他类型全数返回
        if (isObject(param)) {
          // 类型转换
          joinPoint.args[index] = plainToInstance(
            validateOptions?.type || paramTypes[index],
            param,
            { excludeExtraneousValues: true }
          );
          // 验证参数
          const errors = validateSync(joinPoint.args[index]);
          if (errors.length > 0) {
            // 只报错第一个异常
            const errorObj = errors[0].constraints;
            for (const key in errorObj) {
              if (Object.prototype.hasOwnProperty.call(errorObj, key)) {
                throw new BadRequestError(errorObj[key]);
              }
            }
          }
        }
      });
      return joinPoint.proceed(...joinPoint.args);
    },
  };
};
