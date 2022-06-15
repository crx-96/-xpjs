import { isNumber } from './object';

/**
 * 判断是否为整数
 * @param value
 * @param strict
 * @returns
 */
export const isInt = (value: any, strict = true): boolean => {
  return isNumber(value, strict) && Number(value).toFixed(0) === String(value);
};

/**
 * 判断是否是正数
 * @param value
 * @param strict
 * @returns
 */
export const isPositive = (value: any, strict = true): boolean => {
  return isNumber(value, strict) && Number(value) > 0;
};

/**
 * 判断是否是负数
 * @param value
 * @param strict
 * @returns
 */
export const isNegative = (value: any, strict = true): boolean => {
  return isNumber(value, strict) && Number(value) < 0;
};

/**
 * 判断数字范围
 * @param value
 * @param min
 * @param max
 * @param strict
 * @returns
 */
export const numberRange = (value: number, min: number, max: number, strict = true): boolean => {
  return (
    isNumber(value, strict) &&
    isNumber(min, strict) &&
    isNumber(max, strict) &&
    Number(min) <= max &&
    Number(value) >= min &&
    Number(value) <= max
  );
};

/**
 * 数字最小值限制
 * @param value
 * @param min
 * @param strict
 * @returns
 */
export const min = (value: number, min: number, strict = true): boolean => {
  return isNumber(value, strict) && isNumber(min, strict) && Number(value) >= min;
};

/**
 * 数字最大值限制
 * @param value
 * @param max
 * @param strict
 * @returns
 */
export const max = (value: number, max: number, strict = true): boolean => {
  return isNumber(value, strict) && isNumber(max, strict) && Number(value) <= max;
};

/**
 * 将数字转成金额格式
 * @param value
 * @param options
 * @returns
 */
export const numberToMoney = (
  value: number | string,
  options: {
    toFixed?: number; // 返回小数点的位数
    prefix?: string; // 前缀，如￥
    interval?: number; // 每个间隔的位数，比如每3位
    space?: string; // 间隔隔开的符号，比如逗号
    fix?: boolean; // 是否强制添加小数点位数，比如为0的时候返回0.00
    suffix?: string; // 后缀，如元、万等
  } = {
    toFixed: 2,
    prefix: '￥',
    interval: 3,
    space: ',',
    fix: true,
    suffix: '',
  },
): string => {
  // 初始化配置
  options = options || {};
  options.toFixed =
    options.toFixed === undefined ? 2 : min(options.toFixed || 0, 1, false) ? Math.floor(options.toFixed || 0) : 0;
  options.interval =
    options.interval === undefined ? 3 : min(options.interval || 0, 1, false) ? Math.floor(options.interval || 0) : 0;
  options.prefix = options.prefix === undefined ? '￥' : String(options.prefix);
  options.space = options.space === undefined ? ',' : String(options.space);
  options.fix = options.fix === undefined ? true : !!options.fix;
  options.suffix = options.suffix === undefined ? '' : String(options.suffix);
  // 处理数据
  if (isNumber(value, false) && Number(value)) {
    const isNeg = Number(value) < 0;
    value = String(Math.abs(Number(value)));
    let result = value;
    const str: string[] = [];
    const numArr = value.split('.');
    value = numArr[0];
    // 提取重复操作
    const reducerFn = () => {
      if (numArr[1]) {
        result += '.';
        result += numArr[1].slice(0, options.toFixed);
        if (numArr[1].length < (options.toFixed || 2) && options.fix) {
          Array.from({ length: (options.toFixed || 2) - numArr[1].length }).forEach((i) => {
            result += '0';
          });
        }
      } else {
        if (options.fix && (options.toFixed || 2) > 0) {
          result += '.';
          Array.from({ length: options.toFixed || 2 }).forEach((i) => {
            result += '0';
          });
        }
      }
      return options.prefix + (isNeg ? '-' : '') + result + options.suffix;
    };
    if (value.length <= 3) {
      return reducerFn();
    }
    value
      .split('')
      .reverse()
      .forEach((item, index) => {
        if (index !== 0 && index % (options.interval || 3) === 0) {
          str.push(options.space || ',', item);
        } else {
          str.push(item);
        }
      });
    result = str.reverse().join('');
    return reducerFn();
  } else {
    if (options.fix && options.toFixed > 0) {
      let result = '0.';
      Array.from({ length: options.toFixed }).forEach((i) => {
        result += '0';
      });
      return options.prefix + result + options.suffix;
    } else {
      return options.prefix + '0' + options.suffix;
    }
  }
};
