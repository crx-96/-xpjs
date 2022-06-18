import { FORMAT_DEFAULT } from '../../constant';

export default (o: any, c: { prototype: any }) => {
  // locale needed later
  const proto = c.prototype;
  const oldFormat = proto.format;
  // extend en locale here
  proto.format = function (formatStr: string) {
    const yearBias = 543;
    const str = formatStr || FORMAT_DEFAULT;
    const result = str.replace(/(\[[^\]]+])|BBBB|BB/g, (match: string, a: any) => {
      const year = String(this.$y + yearBias);
      const args = match === 'BB' ? [year.slice(-2), 2] : [year, 4];
      return a || this.$utils().s(...args, '0');
    });
    return oldFormat.bind(this)(result);
  };
};
