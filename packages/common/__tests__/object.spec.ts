import { isBoolean, isUUID } from '../index';

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

  it('测试isUUID', () => {
    expect(isUUID('F8F3A0C7-9498-CA1A-48A8-8D4F6732878F')).toBe(true);
    expect(isUUID('F8F3A0C7-9498-CA1A-48A8-8D4F6732878F1')).toBe(false);
  });
});
