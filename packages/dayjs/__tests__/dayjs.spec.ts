import dayjs from '../lib/index';

describe('测试dayjs', () => {
  it('测试', () => {
    expect(dayjs().isValid()).toBe(true);
    expect(dayjs('a').isValid()).toBe(false);
  });
});
