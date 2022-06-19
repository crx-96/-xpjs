export default (
  o: any,
  c: { prototype: any },
  d: () => { (): any; new (): any; subtract: { (arg0: number, arg1: string): any; new (): any } },
) => {
  const proto = c.prototype;
  proto.isYesterday = function () {
    const comparisonTemplate = 'YYYY-MM-DD';
    const yesterday = d().subtract(1, 'day');

    return this.format(comparisonTemplate) === yesterday.format(comparisonTemplate);
  };
};
