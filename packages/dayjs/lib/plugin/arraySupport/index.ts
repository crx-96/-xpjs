export default (o: any, c: any, dayjs: any) => {
  const proto = c.prototype;
  const parseDate = (cfg: { date: any; utc: any }) => {
    const { date, utc } = cfg;
    if (Array.isArray(date)) {
      if (utc) {
        if (!date.length) {
          return new Date();
        }
        return new Date(Date.UTC.apply(null, date as any));
      }
      if (date.length === 1) {
        return dayjs(String(date[0])).toDate();
      }
      return new (Function.prototype.bind.apply(Date, ([null] as any).concat(date)))();
    }
    return date;
  };

  const oldParse = proto.parse;
  proto.parse = function (cfg: { date: any }) {
    cfg.date = parseDate.bind(this)(cfg as any);
    oldParse.bind(this)(cfg);
  };
};
