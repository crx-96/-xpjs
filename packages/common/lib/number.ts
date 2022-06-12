import { isBoolean, isNotEmpty, isNumber } from './object';

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
