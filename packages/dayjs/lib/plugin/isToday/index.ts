export default (o: any, c: { prototype: any }, d: () => any) => {
  const proto = c.prototype;
  proto.isToday = function () {
    const comparisonTemplate = 'YYYY-MM-DD';
    const now = d();

    return this.format(comparisonTemplate) === now.format(comparisonTemplate);
  };
};
