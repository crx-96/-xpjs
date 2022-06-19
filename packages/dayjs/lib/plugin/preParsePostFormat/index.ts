// Plugin template from https://day.js.org/docs/en/plugin/plugin
export default (
  option: any,
  dayjsClass: {
    prototype: {
      parse: (cfg: any) => any;
      format: (...args: any[]) => any;
      fromToBase: (input: any, withoutSuffix: any, instance: any, isFrom: any, d: any) => any;
    };
  },
) => {
  const oldParse = dayjsClass.prototype.parse;
  dayjsClass.prototype.parse = function (cfg: { date: any }) {
    if (typeof cfg.date === 'string') {
      const locale = (this as any).$locale();
      cfg.date = locale && locale.preparse ? locale.preparse(cfg.date) : cfg.date;
    }
    // original parse result
    return oldParse.bind(this)(cfg);
  };

  // // overriding existing API
  // // e.g. extend dayjs().format()
  const oldFormat = dayjsClass.prototype.format;
  dayjsClass.prototype.format = function (...args: any) {
    // original format result
    const result = oldFormat.call(this, ...args);
    // return modified result
    const locale = (this as any).$locale();
    return locale && locale.postformat ? locale.postformat(result) : result;
  };

  const oldFromTo = dayjsClass.prototype.fromToBase;

  if (oldFromTo) {
    dayjsClass.prototype.fromToBase = function (
      input: any,
      withoutSuffix: any,
      instance: { $locale: () => any },
      isFrom: any,
    ) {
      const locale = (this as any).$locale() || instance.$locale();

      // original format result
      return oldFromTo.call(this, input, withoutSuffix, instance, isFrom, locale && locale.postformat);
    };
  }
};
