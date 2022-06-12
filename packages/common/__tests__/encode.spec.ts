import { md5, uuid_v1, isUUID, uuid_v2, uuid_v3 } from '../index';

describe('测试encode', () => {
  it('测试md5', () => {
    expect(md5('djaklsldjl')).toBe('9549DC5BAD20E2E42F8393F5E43D6D1D');
  });
  it('测试uuid', () => {
    expect(isUUID(uuid_v1())).toBe(true);
    expect(isUUID(uuid_v2())).toBe(true);
    expect(isUUID(uuid_v3())).toBe(true);
  });
});
