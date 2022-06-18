export default (o: any, c: { prototype: any }) => {
  // locale needed later
  const proto = c.prototype;
  proto.$g = function (input: any, get: string | number, set: any) {
    if (this.$utils().u(input)) return this[get];
    return this.$set(set, input);
  };

  proto.set = function (string: any, int: any) {
    return this.$set(string, int);
  };

  const oldStartOf = proto.startOf;
  proto.startOf = function (units: any, startOf: any) {
    this.$d = oldStartOf.bind(this)(units, startOf).toDate();
    this.init();
    return this;
  };

  const oldAdd = proto.add;
  proto.add = function (number: any, units: any) {
    this.$d = oldAdd.bind(this)(number, units).toDate();
    this.init();
    return this;
  };

  const oldLocale = proto.locale;
  proto.locale = function (preset: any, object: any) {
    if (!preset) return this.$L;
    this.$L = oldLocale.bind(this)(preset, object).$L;
    return this;
  };

  const oldDaysInMonth = proto.daysInMonth;
  proto.daysInMonth = function () {
    return oldDaysInMonth.bind(this.clone())();
  };

  const oldIsSame = proto.isSame;
  proto.isSame = function (that: any, units: any) {
    return oldIsSame.bind(this.clone())(that, units);
  };

  const oldIsBefore = proto.isBefore;
  proto.isBefore = function (that: any, units: any) {
    return oldIsBefore.bind(this.clone())(that, units);
  };

  const oldIsAfter = proto.isAfter;
  proto.isAfter = function (that: any, units: any) {
    return oldIsAfter.bind(this.clone())(that, units);
  };
};
