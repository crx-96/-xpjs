export default (
  o: any,
  c: { prototype: { isBetween: (a: any, b: any, u: any, i: any) => any } },
  d: (arg0: any) => any,
) => {
  c.prototype.isBetween = function (this: any, a: any, b: any, u: any, i: string | string[]) {
    const dA = d(a);
    const dB = d(b);
    i = i || '()';
    const dAi = i[0] === '(';
    const dBi = i[1] === ')';

    return (
      ((dAi ? this.isAfter(dA, u) : !this.isBefore(dA, u)) && (dBi ? this.isBefore(dB, u) : !this.isAfter(dB, u))) ||
      ((dAi ? this.isBefore(dA, u) : !this.isAfter(dA, u)) && (dBi ? this.isAfter(dB, u) : !this.isBefore(dB, u)))
    );
  };
};
