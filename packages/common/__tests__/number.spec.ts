import { numberToMoney, isNumber } from '../index';

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
});
