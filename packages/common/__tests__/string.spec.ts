import { getRandomString } from '../index';

describe('测试getRandomString方法', () => {
  it('测试getRandomString方法', () => {
    console.log('4位数的all字符串：', getRandomString(4));
    console.log('4位数的数字字符串：', getRandomString(4, 'number'));
    console.log('4位数的小写字母字符串：', getRandomString(4, 'lower'));
    console.log('4位数的大写字母字符串：', getRandomString(4, 'upper'));
    console.log('4位数的大小写字母字符串：', getRandomString(4, 'letter'));

    console.log('4-6位数的all字符串：', getRandomString(4, 6));
    console.log('4-6位数的数字字符串：', getRandomString(4, 6, 'number'));
    console.log('4-6位数的小写字母字符串：', getRandomString(4, 6, 'lower'));
    console.log('4-6位数的大写字母字符串：', getRandomString(4, 6, 'upper'));
    console.log('4-6位数的大小写字母字符串：', getRandomString(4, 6, 'letter'));
    expect(1).toBe(1);
  });
});
