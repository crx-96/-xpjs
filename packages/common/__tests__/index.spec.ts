import { isInt, isPositive } from './../lib/number';
import { md5 } from './../lib/md5';
describe('测试common包的方法', () => {
  it('测试md5', () => {
    expect(md5('123')).toBe('202CB962AC59075B964B07152D234B70');
  });

  it('测试整数', () => {
    expect(isInt(3)).toBe(true);
    expect(isInt('3')).toBe(false);
    expect(isInt('3', false)).toBe(true);
    expect(isInt('3a', false)).toBe(false);
    expect(isInt('3.1', false)).toBe(false);
    expect(isInt(3.1)).toBe(false);
  });

  it('测试正数', () => {
    expect(isPositive(1)).toBe(true);
    expect(isPositive(-1)).toBe(false);
    expect(isPositive('1', false)).toBe(true);
    expect(isPositive('1', true)).toBe(false);
    expect(isPositive('1a', false)).toBe(false);
    expect(isPositive('-1', false)).toBe(false);
  });
});
