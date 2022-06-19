export default (o: any, c: { prototype: any }, dayjs: { (): any; (): any; utc: any }) => {
  const proto = c.prototype;
  const isObject = (obj: any) => !(obj instanceof Date) && !(obj instanceof Array) && obj instanceof Object;
  const prettyUnit = (u: string) => {
    const unit = proto.$utils().p(u);
    return unit === 'date' ? 'day' : unit;
  };
  const parseDate = (cfg: { date: any; utc: any }) => {
    const { date, utc } = cfg;
    const $d: any = {};
    if (isObject(date)) {
      if (!Object.keys(date).length) {
        return new Date();
      }
      const now = utc ? dayjs.utc() : dayjs();
      Object.keys(date).forEach((k) => {
        $d[prettyUnit(k)] = date[k];
      });
      const d = $d.day || (!$d.year && !($d.month >= 0) ? now.date() : 1);
      const y = $d.year || now.year();
      const M = $d.month >= 0 ? $d.month : !$d.year && !$d.day ? now.month() : 0; // eslint-disable-line no-nested-ternary,max-len
      const h = $d.hour || 0;
      const m = $d.minute || 0;
      const s = $d.second || 0;
      const ms = $d.millisecond || 0;
      if (utc) {
        return new Date(Date.UTC(y, M, d, h, m, s, ms));
      }
      return new Date(y, M, d, h, m, s, ms);
    }
    return date;
  };

  const oldParse = proto.parse;
  proto.parse = function (cfg: { date: any }) {
    cfg.date = parseDate.bind(this)(cfg as any);
    oldParse.bind(this)(cfg);
  };

  const oldSet = proto.set;
  const oldAdd = proto.add;

  const callObject = function (
    this: any,
    call: { bind: (arg0: any) => { (arg0: number, arg1: string): any; new (): any } },
    argument: any,
    string: any,
    offset = 1,
  ) {
    if (argument instanceof Object) {
      const keys = Object.keys(argument);
      let chain = this;
      keys.forEach((key) => {
        chain = call.bind(chain)(argument[key] * offset, key);
      });
      return chain;
    }
    return call.bind(this)(argument * offset, string);
  };

  proto.set = function (string: any, int: undefined) {
    int = int === undefined ? string : int;
    return callObject.bind(this)(
      function (this: any, i: any, s: any) {
        return oldSet.bind(this)(s, i);
      },
      int,
      string,
    );
  };
  proto.add = function (number: any, string: any) {
    return callObject.bind(this)(oldAdd, number, string);
  };
  proto.subtract = function (number: any, string: any) {
    return callObject.bind(this)(oldAdd, number, string, -1);
  };
};
