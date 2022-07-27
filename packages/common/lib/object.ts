import { MergeEnum } from './enum/merge.enum';

const throttleFlag: any = {};
const debounceFlg: any = {};

export const isNumber = (value: any, strict = true): boolean => {
  if (strict) return typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]';
  else return !isNaN(Number(value)) && isNotEmpty(value) && !isBoolean(value);
};

export const isString = (value: any): boolean => {
  return (
    typeof value === 'string' || value instanceof String || Object.prototype.toString.call(value) === '[object String]'
  );
};

export const isBoolean = (value: any): boolean => {
  return typeof value === 'boolean' || Object.prototype.toString.call(value) === '[object Boolean]';
};

export const isNotEmpty = (value: any): boolean => {
  return value !== '' && value !== null && value !== undefined;
};

export const getDataType = (value: any) => {
  return Object.prototype.toString.call(value);
};

export const sleep = (time: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export const isArray = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object Array]';
};

export const isObject = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

export const isFunction = (value: any): boolean => {
  return typeof value === 'function' || Object.prototype.toString.call(value) === '[object Function]';
};

export const isNull = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object Null]';
};

export const isUndefined = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object Undefined]';
};

export const isSymbol = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object Symbol]';
};

export const isBigInt = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object BigInt]';
};

export const isMap = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object Map]';
};

export const isWeakMap = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object WeakMap]';
};

export const isSet = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object Set]';
};

export const isWeakSet = (value: any): boolean => {
  return Object.prototype.toString.call(value) === '[object WeakSet]';
};

export const throttle = (fn: () => void, time = 500, isImmediate = true, timeoutName = 'default') => {
  if (isImmediate) {
    // 立即执行
    if (!throttleFlag[timeoutName]) {
      throttleFlag[timeoutName] = true;
      // 函数立即执行
      if (typeof fn === 'function') fn();
      throttleFlag[timeoutName + 'Fn'] = setTimeout(() => {
        delete throttleFlag[timeoutName];
        delete throttleFlag[timeoutName + 'Fn'];
      }, time);
    }
  } else {
    // 延迟执行
    if (!throttleFlag[timeoutName]) {
      throttleFlag[timeoutName] = true;
      // 函数延迟执行
      throttleFlag[timeoutName + 'Fn'] = setTimeout(() => {
        if (typeof fn === 'function') fn();
        delete throttleFlag[timeoutName];
        delete throttleFlag[timeoutName + 'Fn'];
      }, time);
    }
  }
};

export const clearThrottle = (timeoutName = 'default') => {
  clearTimeout(throttleFlag[timeoutName + 'Fn']);
  delete throttleFlag[timeoutName];
  delete throttleFlag[timeoutName + 'Fn'];
};

export const debounce = (fn: () => void, wait = 500, immediate = false, timeoutName = 'default') => {
  // 已存在定时器则清除同时重新绑定
  if (debounceFlg[timeoutName + 'Fn']) clearDebounce(timeoutName);
  if (immediate) {
    // 立即执行，一般用不到
    if (typeof fn === 'function') fn();
    debounceFlg[timeoutName + 'Fn'] = setTimeout(() => {
      delete debounceFlg[timeoutName + 'Fn'];
    }, wait);
  } else {
    // 延迟执行
    debounceFlg[timeoutName + 'Fn'] = setTimeout(() => {
      if (typeof fn === 'function') fn();
      delete debounceFlg[timeoutName + 'Fn'];
    }, wait);
  }
};

export const clearDebounce = (timeoutName = 'default') => {
  clearTimeout(debounceFlg[timeoutName + 'Fn']);
  delete debounceFlg[timeoutName + 'Fn'];
};

export const deepClone = <T = any>(value: T): T => {
  // 基本类型直接返回
  if (
    isNull(value) ||
    isBigInt(value) ||
    isBoolean(value) ||
    isNumber(value) ||
    isString(value) ||
    isSymbol(value) ||
    isUndefined(value)
  ) {
    return value;
  }
  // 数组递归返回
  if (isArray(value)) {
    return (value as any).map((item: any) => deepClone(item));
  }
  // 函数类型返回新函数
  if (isFunction(value)) {
    try {
      return new Function('return ' + (value as any).toString())();
    } catch (error) {
      return value;
    }
  }
  // 对象遍历返回
  if (isObject(value)) {
    const obj: any = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        obj[key] = deepClone(value[key]);
      }
    }
    return obj;
  }
  // map类型
  if (isMap(value)) {
    const obj = new Map();
    const keys = (value as any).keys() as any[];
    for (const name of keys) {
      obj.set(name, deepClone((value as any).get(name)));
    }
    return obj as any;
  }
  // set类型
  if (isSet(value)) {
    const obj = new Set();
    const keys = (value as any).keys() as any[];
    for (const name of keys) {
      obj.add(deepClone(name));
    }
    return obj as any;
  }

  // 其他类型直接返回
  return value;
};

/**
 * 对象合并
 * @param source1
 * @param source2
 * @param arrayOverride 当数据为数组的时候，0-后面的直接覆盖前面的，1-数组相同位置的对象合并，2-后面的数组内容加到前面的数组
 * @param first
 * @returns 合并失败返回第一个数据源
 */
const deepMergeTemp = (source1: any, source2: any, arrayOverride = 0, first = false, ignoreEmpty = true): any => {
  if (getDataType(source1) === getDataType(source2)) {
    // map类型
    if (isMap(source1)) {
      const obj = deepClone<Map<any, any>>(source1);
      const obj2 = deepClone<Map<any, any>>(source2);
      const keys = obj2.keys() as unknown as any[];
      for (const name of keys) {
        if (obj.has(name)) {
          obj.set(name, deepMergeTemp(obj.get(name), obj2.get(name), arrayOverride, false, ignoreEmpty));
        } else {
          obj.set(name, obj2.get(name));
        }
      }
      return obj;
    }
    // set类型
    if (isSet(source1)) {
      const obj = deepClone<Set<any>>(source1);
      const obj2 = deepClone<Set<any>>(source2);
      const keys = obj2.keys() as unknown as any[];
      for (const name of keys) {
        if (!obj.has(name)) {
          obj.add(name);
        }
      }
      return obj;
    }
    // 对象类型
    if (isObject(source1)) {
      const obj = deepClone(source1);
      const obj2 = deepClone(source2);
      for (const key in obj2) {
        if (Object.prototype.hasOwnProperty.call(obj2, key)) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj[key] = deepMergeTemp(obj[key], obj2[key], arrayOverride, false, ignoreEmpty);
          } else {
            obj[key] = obj2[key];
          }
        }
      }
      return obj;
    }
    // 数组类型
    if (isArray(source1)) {
      const arr = deepClone<any[]>(source1);
      const arr2 = deepClone<any[]>(source2);
      if (arrayOverride === MergeEnum.Push) {
        arr2.forEach((item) => {
          arr.push(item);
        });
        return arr;
      } else if (arrayOverride === MergeEnum.Merge) {
        const jg = Math.abs(arr.length - arr2.length);
        const result: any[] = [];
        if (arr.length > arr2.length) {
          arr.forEach((item, index) => {
            if (index < arr2.length) {
              result.push(deepMergeTemp(item, arr2[index], arrayOverride, false, ignoreEmpty));
            }
          });
          for (let i = 0; i < jg; i++) {
            result.push(arr[arr2.length + i]);
          }
        } else {
          arr2.forEach((item, index) => {
            result.push(deepMergeTemp(arr[index], item, arrayOverride, false, ignoreEmpty));
          });
        }
        return result;
      }
      return arr2;
    }
  }

  if (first) {
    return source1;
  } else {
    return isNotEmpty(source2) || !ignoreEmpty ? source2 : source1;
  }
};

export const deepMerge = (
  source1: object,
  source2: object,
  arrayOverride: MergeEnum = MergeEnum.Override,
  ignoreEmpty = false,
): object => {
  return deepMergeTemp(source1, source2, arrayOverride, true, ignoreEmpty);
};
