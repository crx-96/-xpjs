import dayjs from '../lib/index';
import '../lib/locale/zh-cn';
import isLeapYear from '../lib/plugin/isLeapYear';

dayjs.locale('zh-cn');
dayjs.extend(isLeapYear);

describe('测试dayjs', () => {
  it('测试', () => {
    expect(dayjs().isValid()).toBe(true);
    expect(dayjs('a').isValid()).toBe(false);
    expect(dayjs('2022-06-19 12:12:12').second()).toBe(12);
    expect(dayjs('2022-06-19 12:12:12').second(30).format('YYYY-MM-DD HH:mm:ss')).toBe('2022-06-19 12:12:30');
    expect(dayjs('2022-06-19 12:12:12').date(30).format('YYYY-MM-DD HH:mm:ss')).toBe('2022-06-30 12:12:12');
    expect(dayjs('2022-06-19 12:12:12').date(31).format('YYYY-MM-DD HH:mm:ss')).toBe('2022-07-01 12:12:12');
    expect(dayjs('2022-06-19 12:12:12').day(5).format('YYYY-MM-DD HH:mm:ss')).toBe('2022-06-24 12:12:12');
    expect(dayjs('2022-06-18 12:12:12').day(5).format('YYYY-MM-DD HH:mm:ss')).toBe('2022-06-17 12:12:12');
    expect(dayjs('2022-06-18 12:12:12').day(5).format('YYYY-MM-DD HH:mm:ss dddd')).toBe('2022-06-17 12:12:12 星期五');
    expect(dayjs('2022-06-18 12:12:12').isLeapYear()).toBe(false);
    expect(dayjs('2000-06-18 12:12:12').isLeapYear()).toBe(true);
    expect(dayjs('a').second()).toBe(NaN);
  });
});
