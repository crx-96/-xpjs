import { numberToMoney, isNumber, getRandomInt } from '../index';

describe('测试数字的方法', () => {
  it('测试isNumber', () => {
    expect(isNumber('0.000', false)).toBe(true);
  });

  it('测试numberToMoney', () => {
    expect(numberToMoney('a')).toBe('￥0.00');
    expect(numberToMoney('a', { fix: false })).toBe('￥0');
    expect(numberToMoney('a', { prefix: '$', suffix: '元' })).toBe('$0.00元');
    expect(numberToMoney('123', { prefix: '$' })).toBe('$123.00');
    expect(numberToMoney('123', { prefix: '$', fix: false })).toBe('$123');
    expect(numberToMoney('-123', { prefix: '$', fix: false })).toBe('$-123');
    expect(numberToMoney('-123', { prefix: '$' })).toBe('$-123.00');
    expect(numberToMoney('-123', { prefix: '$', suffix: '元' })).toBe('$-123.00元');
    expect(numberToMoney('-1234', { prefix: '$', suffix: '元' })).toBe('$-1,234.00元');
    expect(numberToMoney('-1234.1', { prefix: '$', suffix: '元' })).toBe('$-1,234.10元');
    expect(numberToMoney('1234.1', { prefix: '$', suffix: '元' })).toBe('$1,234.10元');
    expect(numberToMoney('1234.1', { prefix: '$', suffix: '元', fix: false })).toBe('$1,234.1元');
    expect(numberToMoney('12313234.1', { prefix: '$', suffix: '元', fix: false })).toBe('$12,313,234.1元');
    expect(numberToMoney('-12313234.1', { prefix: '$', suffix: '元', fix: false })).toBe('$-12,313,234.1元');
  });

  it('测试getRandomInt方法', () => {
    const arr1: number[] = [];
    for (let i = 1; i <= 1000; i++) {
      arr1.push(getRandomInt(10));
    }
    console.log(arr1.join(','));
    const arr2: number[] = [];
    for (let i = 1; i <= 1000; i++) {
      arr2.push(getRandomInt(-10, 10));
    }
    console.log(arr2.join(','));
    expect(arr1.every((i) => i >= 0 && i <= 10)).toBe(true);
    expect(getRandomInt(5, 5)).toBe(5);
    expect(getRandomInt(-3, -3)).toBe(-3);
    expect(arr1.every((i) => i >= -10 && i <= 10)).toBe(true);
  });
});
