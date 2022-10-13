import { RegEnum } from './enum/reg.enum';
import { getRandomInt } from './number';
import { isArray, isNumber, isObject, isString, isUndefined } from './object';

type trimPosition = 'all' | 'both' | 'left' | 'right' | 'center';

/**
 * 清除空格
 * @param value
 * @param position
 * @returns
 */
export const trim = (value: string, position: trimPosition = 'both'): string => {
  if (!isString(value)) {
    return String(value);
  }
  if (!value) return value;
  if (position === 'all') {
    return value.replace(/\s*/g, '');
  }
  if (position === 'both') {
    return value.replace(/^\s*|\s*$/g, '');
  }
  if (position === 'left') {
    return value.replace(/^\s*/, '');
  }
  if (position === 'right') {
    return value.replace(/\s*$/, '');
  }
  if (position === 'center') {
    let start = '';
    let end = '';
    value.replace(/^\s*/, (regValue: string) => {
      start = regValue;
      return regValue;
    });
    value.replace(/\s*$/, (regValue: string) => {
      end = regValue;
      return regValue;
    });
    return start + trim(value, 'all') + end;
  }
  return value;
};

/**
 * 判断是否是数字字符串
 * @param value
 * @returns
 */
export const isStringNumber = (value: any): boolean => {
  return isString(value) && !isNaN(Number(value));
};

/**
 * 判断字符串长度
 * @param value
 * @param min
 * @param max
 * @returns
 */
export const stringRange = (value: string, min: number, max: number): boolean => {
  min = Number(min);
  max = Number(max);
  if (isString(value) && !isNaN(min) && !isNaN(max) && min <= max) {
    return value.length >= min && value.length <= max;
  }
  return false;
};

/**
 * 判断字符串长度
 * @param value
 * @param length
 * @returns
 */
export const maxLength = (value: string, length: number): boolean => {
  length = Number(length);
  if (isString(value) && !isNaN(length)) {
    return value.length <= length;
  }
  return false;
};

/**
 * 判断字符串长度
 * @param value
 * @param length
 * @returns
 */
export const minLength = (value: string, length: number): boolean => {
  length = Number(length);
  if (isString(value) && !isNaN(length)) {
    return value.length >= length;
  }
  return false;
};

/**
 * 判断是否大写
 * @param value
 * @returns
 */
export const isUpperCase = (value: string): boolean => {
  return isString(value) && value.toUpperCase() === value;
};

/**
 * 判断是否小写
 * @param value
 * @returns
 */
export const isLowerCase = (value: string): boolean => {
  return isString(value) && value.toLowerCase() === value;
};

/**
 * 判断是否是邮箱
 * @param value
 * @returns
 */
export const isEmail = (value: string): boolean => {
  return isString(value) && new RegExp(RegEnum.EMAIL).test(value);
};

/**
 * 判断是否是手机号码
 * @param value
 * @returns
 */
export const isMobile = (value: string): boolean => {
  return isString(value) && new RegExp(RegEnum.MOBILE).test(value);
};

/**
 * 判断是否是url
 * @param value
 * @returns
 */
export const isUrl = (value: string): boolean => {
  return isString(value) && new RegExp(RegEnum.URL).test(value);
};

/**
 * 判断是否是身份证idcard
 * @param value
 * @returns
 */
export const isIdCard = (value: string): boolean => {
  return isString(value) && new RegExp(RegEnum.ID_CARD).test(value);
};

/**
 * 判断是否是车牌号
 * @param value
 * @returns
 */
export const isCarNo = (value: string): boolean => {
  if (isString(value)) {
    if (value.length === 7) {
      return new RegExp(RegEnum.OLD_CAR_NO).test(value);
    }
    if (value.length === 8) {
      return new RegExp(RegEnum.NEW_CAR_NO).test(value);
    }
  }
  return false;
};

/**
 * 判断是否是字母
 * @param value
 * @returns
 */
export const isLetter = (value: string): boolean => {
  return isString(value) && new RegExp(RegEnum.LETTER).test(value);
};

/**
 * 判断中文
 * @param value
 * @returns
 */
export const isChinese = (value: string): boolean => {
  return isString(value) && new RegExp(RegEnum.CHINESE).test(value);
};

/**
 * 判断是否是座机
 * @param value
 * @returns
 */
export const isLandline = (value: string): boolean => {
  return isString(value) && new RegExp(RegEnum.LAND_LINE).test(value);
};

/**
 * 判断是否是json字符串
 * @param value
 * @param checkBase 是否验证基础类型，比如"123"转换成123
 * @returns
 */
export const isStringJson = (value: string, checkBase = true): boolean => {
  if (isString(value)) {
    try {
      const obj = JSON.parse(value);
      return !!checkBase || ((isObject(obj) || isArray(obj)) && !!obj);
    } catch (error) {}
  }
  return false;
};

/**
 * 根据后缀名判断文件是否是图片
 * @param fileName
 * @returns
 */
export const isImageByExtName = (fileName: string): boolean => {
  // 图片的后缀名
  const imgExt = ['.png', '.jpg', '.jpeg', '.bmp', '.gif', 'svg'];
  // 将名称转成小写字符
  const name = fileName.toLowerCase();
  // 判断是否以图片后缀名结尾
  return imgExt.some((item) => name.endsWith(item));
};

/**
 * 根据后缀名判断文件是否是视频格式
 * @param fileName
 * @returns
 */
export const isVideoByExtName = (fileName: string): boolean => {
  // 视频的后缀名
  const videoExt = [
    '.wmv',
    '.asf',
    '.asx',
    '.rm',
    '.rmvb',
    'mp4',
    '3gp',
    'mov',
    'm4v',
    'avi',
    'dat',
    'mkv',
    'flv',
    'vob',
  ];
  // 将名称转成小写字符
  const name = fileName.toLowerCase();
  // 判断是否以图片后缀名结尾
  return videoExt.some((item) => name.endsWith(item));
};

/**
 * 根据后缀名判断文件是否是音频格式
 * @param fileName
 * @returns
 */
export const isAudioByExtName = (fileName: string): boolean => {
  // 音频的后缀名
  const videoExt = ['.wav', '.flac', '.ape', '.alac', '.wavpack', 'wv', 'mp3', 'aac', 'ogg', 'opus'];
  // 将名称转成小写字符
  const name = fileName.toLowerCase();
  // 判断是否以图片后缀名结尾
  return videoExt.some((item) => name.endsWith(item));
};

/**
 * 验证是否是uuid
 * @param value
 * @returns
 */
export const isUUID = (value: string): boolean => {
  return isString(value) && new RegExp(RegEnum.UUID).test(value);
};

/**
 * 生成随机字符串
 * type：
 * all-大小写字母和数字
 * number-数字
 * letter-大小写字母
 * upper-大写字母
 * lower-小写字母
 * lower_number-小写字母和数字
 * upper_number-大写字母和数字
 */
export type RandomType = 'all' | 'number' | 'letter' | 'upper' | 'lower' | 'lower_number' | 'upper_number';
export function getRandomString(length: number): string;
export function getRandomString(length: number, type: RandomType): string;
export function getRandomString(minLength: number, maxLength: number): string;
export function getRandomString(minLength: number, maxLength: number, type: RandomType): string;
export function getRandomString(minLength: number, maxLength?: number | RandomType, type?: RandomType): string {
  if (isNumber(minLength, false)) {
    minLength = Math.floor(Number(minLength));
    if (isUndefined(maxLength)) {
      return getRandom(minLength, 'all');
    } else {
      if (isNumber(maxLength, false)) {
        const length = getRandomInt(minLength, maxLength as number);
        return getRandom(length, type || 'all');
      } else {
        return getRandom(minLength, maxLength as RandomType);
      }
    }
  }
  return '';
}
function getRandom(length: number, type: RandomType): string {
  let str = '';
  let result = '';
  const upperStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerStr = upperStr.toLowerCase();
  const number = '0123456789';
  switch (type) {
    case 'letter':
      str = upperStr + lowerStr;
      break;
    case 'lower':
      str = lowerStr;
      break;
    case 'lower_number':
      str = lowerStr + number;
      break;
    case 'number':
      str = number;
      break;
    case 'upper':
      str = upperStr;
      break;
    case 'upper_number':
      str = upperStr + number;
      break;
    default:
      str = upperStr + lowerStr + number;
  }
  for (let i = 0; i < length; i++) {
    result += str[Math.floor(Math.random() * str.length)];
  }
  return result;
}
