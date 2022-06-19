export default (o: any, c: { prototype: any }) => {
  const proto = c.prototype;
  proto.isLeapYear = function () {
    return (this.$y % 4 === 0 && this.$y % 100 !== 0) || this.$y % 400 === 0;
  };
};
