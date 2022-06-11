import { md5 } from '../index';

describe('测试encode', () => {
  it('测试md5', () => {
    expect(md5('djaklsldjl')).toBe('9549DC5BAD20E2E42F8393F5E43D6D1D');
  });
});
