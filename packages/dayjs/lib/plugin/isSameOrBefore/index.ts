export default (o: any, c: { prototype: { isSameOrBefore: (that: any, units: any) => any } }) => {
  c.prototype.isSameOrBefore = function (that: any, units: any) {
    return (this as any).isSame(that, units) || (this as any).isBefore(that, units);
  };
};
