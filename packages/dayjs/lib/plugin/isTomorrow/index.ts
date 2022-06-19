export default (
  o: any,
  c: { prototype: any },
  d: () => { (): any; new (): any; add: { (arg0: number, arg1: string): any; new (): any } },
) => {
  const proto = c.prototype;
  proto.isTomorrow = function () {
    const comparisonTemplate = 'YYYY-MM-DD';
    const tomorrow = d().add(1, 'day');

    return this.format(comparisonTemplate) === tomorrow.format(comparisonTemplate);
  };
};
