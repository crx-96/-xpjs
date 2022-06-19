export default (o: any, c: { prototype: any }) => {
  const proto = c.prototype;
  proto.isoWeeksInYear = function () {
    const isLeapYear = this.isLeapYear();
    const last = this.endOf('y');
    const day = last.day();
    if (day === 4 || (isLeapYear && day === 5)) {
      return 53;
    }
    return 52;
  };
};
