import { XPNumber } from '../lib/index';

describe('测试number方法', () => {
  it('测试数字方法', () => {
    expect(XPNumber(123).plus(2).toNumber()).toBe(125);
    expect(new XPNumber(123).plus(2).toNumber()).toBe(125);
  });
});
