import * as C from '../../constant';

export default (
  o: { thresholds?: any; rounding?: any },
  c: { prototype: any },
  d: {
    (arg0: undefined): { (): any; new (): any; diff: { (arg0: any, arg1: any, arg2: boolean): any; new (): any } };
    (arg0: undefined): { (): any; new (): any; diff: { (arg0: any, arg1: any, arg2: boolean): any; new (): any } };
    en: any;
    utc: any;
  },
) => {
  o = o || {};
  const proto = c.prototype;
  const relObj = {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  };
  d.en.relativeTime = relObj;
  proto.fromToBase = (
    input: any,
    withoutSuffix: any,
    instance: {
      $locale: () => {
        (): any;
        new (): any;
        relativeTime: {
          future: string;
          past: string;
          s: string;
          m: string;
          mm: string;
          h: string;
          hh: string;
          d: string;
          dd: string;
          M: string;
          MM: string;
          y: string;
          yy: string;
        };
      };
      diff: (arg0: any, arg1: any, arg2: boolean) => any;
    },
    isFrom: any,
    postFormat: (arg0: string) => any,
  ) => {
    const loc = instance.$locale().relativeTime || relObj;
    const T = o.thresholds || [
      { l: 's', r: 44, d: C.S },
      { l: 'm', r: 89 },
      { l: 'mm', r: 44, d: C.MIN },
      { l: 'h', r: 89 },
      { l: 'hh', r: 21, d: C.H },
      { l: 'd', r: 35 },
      { l: 'dd', r: 25, d: C.D },
      { l: 'M', r: 45 },
      { l: 'MM', r: 10, d: C.M },
      { l: 'y', r: 17 },
      { l: 'yy', d: C.Y },
    ];
    const Tl = T.length;
    let result;
    let out;
    let isFuture;

    for (let i = 0; i < Tl; i += 1) {
      let t = T[i];
      if (t.d) {
        result = isFrom ? d(input).diff(instance, t.d, true) : instance.diff(input, t.d, true);
      }
      let abs = (o.rounding || Math.round)(Math.abs(result));
      isFuture = result > 0;
      if (abs <= t.r || !t.r) {
        if (abs <= 1 && i > 0) t = T[i - 1]; // 1 minutes -> a minute, 0 seconds -> 0 second
        const format = (loc as any)[t.l];
        if (postFormat) {
          abs = postFormat(`${abs}`);
        }
        if (typeof format === 'string') {
          out = format.replace('%d', abs);
        } else {
          out = format(abs, withoutSuffix, t.l, isFuture);
        }
        break;
      }
    }
    if (withoutSuffix) return out;
    const pastOrFuture = isFuture ? loc.future : loc.past;
    if (typeof pastOrFuture === 'function') {
      return (pastOrFuture as any)(out);
    }
    return pastOrFuture.replace('%s', out);
  };

  function fromTo(input: any, withoutSuffix: any, instance: any, isFrom: boolean | undefined) {
    return proto.fromToBase(input, withoutSuffix, instance, isFrom);
  }

  proto.to = function (input: any, withoutSuffix: any) {
    return fromTo(input, withoutSuffix, this, true);
  };
  proto.from = function (input: any, withoutSuffix: any) {
    return fromTo(input, withoutSuffix, this, undefined);
  };

  const makeNow = (thisDay: { $u: any }) => (thisDay.$u ? d.utc() : d(undefined));

  proto.toNow = function (withoutSuffix: any) {
    return this.to(makeNow(this), withoutSuffix);
  };
  proto.fromNow = function (withoutSuffix: any) {
    return this.from(makeNow(this), withoutSuffix);
  };
};
