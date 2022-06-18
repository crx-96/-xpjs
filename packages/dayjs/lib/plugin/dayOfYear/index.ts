export default (
  o: any,
  c: { prototype: any },
  d: (arg0: any) => { (): any; new (): any; startOf: { (arg0: string): number; new (): any } },
) => {
  const proto = c.prototype;
  proto.dayOfYear = function (input: number | null) {
    // d(this) is for badMutable
    const dayOfYear = Math.round((d(this).startOf('day') - d(this).startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add(input - dayOfYear, 'day');
  };
};
