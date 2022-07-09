import bigjs, { RoundingMode } from '../lib/index';

describe('测试bigjs', () => {
  it('测试普通方法与构造函数方法的结果是否一致', () => {
    expect(bigjs(123).toFixed(2)).toBe(new bigjs(123).toFixed(2));
  });

  it('测试绝对值的方法', () => {
    expect(bigjs(-0.88).abs().toNumber()).toBe(0.88);
    expect(bigjs(0.88).abs().toNumber()).toBe(0.88);
  });

  it('测试比较的方法', () => {
    expect(bigjs(123).cmp(123)).toBe(0);
    expect(bigjs(124).cmp(123)).toBe(1);
    expect(bigjs(122).cmp(123)).toBe(-1);
    expect(bigjs('123').cmp('1221')).toBe(-1);
  });

  it('测试toFixed方法', () => {
    // 0,1,2,3,默认1
    expect(bigjs(45.6).toFixed()).toBe('45.6');
    expect(bigjs(45.6).toFixed(0)).toBe('46');
    expect((45.6).toFixed()).toBe('46');
    expect(bigjs(45.6).toFixed(0, RoundingMode.RoundHalfUp)).toBe('46');
    expect(bigjs(45.6).toFixed(0, RoundingMode.RoundHalfEven)).toBe('46');
    expect(bigjs(45.5).toFixed(0, RoundingMode.RoundDown)).toBe('45');
    expect(bigjs(45.4).toFixed(0, RoundingMode.RoundHalfEven)).toBe('45');
    expect(bigjs(45.2).toFixed(0, RoundingMode.RoundUp)).toBe('46');
  });

  it('测试除法的方法', () => {
    expect(bigjs(1).div(3).toFixed(2)).toBe('0.33');
    expect(bigjs(6).div(2).toFixed(2)).toBe('3.00');
    expect(bigjs(9).div(3).toNumber()).toBe(3);
  });

  it('测试计算', () => {
    const result = bigjs(9).div(3).mod(2).plus(5).times(6).toNumber();
    expect(result).toBe(36);
  });
});
