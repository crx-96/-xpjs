export default (o: any, c: { prototype: { isSameOrAfter: (that: any, units: any) => any } }) => {
  c.prototype.isSameOrAfter = function (this: any, that: any, units: any) {
    return this.isSame(that, units) || this.isAfter(that, units);
  };
};
