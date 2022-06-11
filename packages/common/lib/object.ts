const throttleFlag: any = {};
const debounceFlg: any = {};

export const isBoolean = (value: any): boolean => {
  return typeof value === 'boolean' || Object.prototype.toString.call(value) === '[object Boolean]';
};

export const isNotEmpty = (value: any): boolean => {
  return value !== '' && value !== null && value !== undefined;
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
