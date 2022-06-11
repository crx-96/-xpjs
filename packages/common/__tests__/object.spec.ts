import { isBoolean } from '../index';

describe('测试object方法', () => {
  it('测试isBoolean', () => {
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean('1')).toBe(false);
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean([])).toBe(false);
    expect(isBoolean({})).toBe(false);
  });
});
