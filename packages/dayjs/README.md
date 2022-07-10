# `dayjs`

## 使用

```js
import dayjs from '@xpjs/dayjs';

// 国际化
import '@xpjs/locale/zh-cn';
dayjs.locale('zh-cn');

console.log(dayjs('2022-06-19 12:12:12').day(5).format('YYYY-MM-DD HH:mm:ss'));// 2022-06-24 12:12:12

// 使用插件
import isLeapYear from '@xpjs/plugin/isLeapYear';
dayjs.extend(isLeapYear);

console.log(dayjs('2022-06-18 12:12:12').isLeapYear());// false
console.log(dayjs('2000-06-18 12:12:12').isLeapYear());// true
```

具体参考[dayjs](https://dayjs.fenxianglu.cn/)
