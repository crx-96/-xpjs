import { BadRequestError } from '@midwayjs/core/dist/error/http';
import { isArray, isObject } from '@xpjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

const handleTypeData = (
  options: {
    target: new (...args: any[]) => any;
    propertyName: string;
    metadata: any;
    originArgs: Array<any>;
    originParamType: any;
    parameterIndex: number;
  },
  result: any
): any => {
  // 处理Number类型
  if (options.originParamType.prototype.constructor === Number) {
    result = Number(result).valueOf() || 0;
  } else if (options.originParamType.prototype.constructor === Boolean) {
    // 处理Boolean类型
    result = Boolean(result).valueOf();
  } else if (options.originParamType.prototype.constructor === String) {
    // 处理String类型
    if (typeof result === 'object') {
      result = JSON.stringify(result);
    } else {
      result = String(result).valueOf();
    }
  } else if (options.originParamType.prototype.constructor === Object) {
    // 处理any类型（Object类型）
    result = Object(result).valueOf();
  } else if (options.originParamType.prototype.constructor === Array) {
    // 处理数组类型
    if (isArray(result)) {
      if (options.metadata.type) {
        result = result.map(item => {
          return handleTypeData(
            Object.assign(JSON.parse(JSON.stringify(options)), {
              metadata: {},
              originParamType: options.metadata.type,
              originArgs: options.originArgs,
            }),
            item
          );
        });
      }
    } else {
      result = [];
    }
  } else {
    // 处理class类型
    if (isObject(result)) {
      result = plainToInstance(options.originParamType, result, { excludeExtraneousValues: true });
      const errors = validateSync(result);
      if (errors.length) {
        let errMsg = '';
        const obj = errors[0].constraints;
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            errMsg = errMsg || obj[key];
          }
        }
        options.originArgs[0].errorMsg = errMsg;
      }
    }
  }
  return result;
};

/**
 * 自定义http参数装饰器实现
 * @param type
 * @returns
 */
export const HttpDecoratorHandle = (type: 'query' | 'body' | 'param') => {
  return (options: {
    target: new (...args: any[]) => any;
    propertyName: string;
    metadata: any;
    originArgs: Array<any>;
    originParamType: any;
    parameterIndex: number;
  }): any => {
    let result: any;
    if (type === 'body') {
      result = options.originArgs[0].request.body;
    }
    if (type === 'param') {
      result = options.originArgs[0].params;
    }
    if (type === 'query') {
      result = options.originArgs[0].query;
    }
    result = options.metadata.key ? result[options.metadata.key] : result;
    return handleTypeData(options, result);
  };
};

/**
 * 自定义validate方法装饰器实现
 */
export const ValidateDecoratorHandle = () => {
  return {
    async around(joinPoint) {
      if (joinPoint.target.ctx.errorMsg) {
        throw new BadRequestError(joinPoint.target.ctx.errorMsg);
      }
      return joinPoint.proceed(...joinPoint.args);
    },
  };
};
