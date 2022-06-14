// import { XPBig } from '../lib/index';
// import { XPBig } from '../lib';
// import { XPBig } from '../cjs';
import { XPBig } from '../bundle';

describe('测试number方法', () => {
  it('测试数字方法', () => {
    expect(XPBig(123).plus(2).toNumber()).toBe(125);
    expect(new XPBig(123).plus(2).toNumber()).toBe(125);
  });
});
