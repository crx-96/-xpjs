import {
  MILLISECONDS_A_DAY,
  MILLISECONDS_A_HOUR,
  MILLISECONDS_A_MINUTE,
  MILLISECONDS_A_SECOND,
  MILLISECONDS_A_WEEK,
  REGEX_FORMAT,
} from '../../constant';

const MILLISECONDS_A_YEAR = MILLISECONDS_A_DAY * 365;
const MILLISECONDS_A_MONTH = MILLISECONDS_A_DAY * 30;

const durationRegex =
  /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

const unitToMS = {
  years: MILLISECONDS_A_YEAR,
  months: MILLISECONDS_A_MONTH,
  days: MILLISECONDS_A_DAY,
  hours: MILLISECONDS_A_HOUR,
  minutes: MILLISECONDS_A_MINUTE,
  seconds: MILLISECONDS_A_SECOND,
  milliseconds: 1,
  weeks: MILLISECONDS_A_WEEK,
};

const isDuration = (d: any) => d instanceof Duration; // eslint-disable-line no-use-before-define

let $d: () => {
  (): any;
  new (): any;
  add: {
    (arg0: any, arg1: string): {
      (): any;
      new (): any;
      locale: { (arg0: any): { (): any; new (): any; fromNow: { (arg0: boolean): any; new (): any } }; new (): any };
    };
    new (): any;
  };
};
let $u: { p: (arg0: any) => any; s: (arg0: any, arg1: number, arg2: string) => any };

const wrapper = (input: number, instance: any, unit: undefined) => new Duration(input, unit, instance.$l); // eslint-disable-line no-use-before-define

const prettyUnit = (unit: string) => `${$u.p(unit)}s`;
const isNegative = (number: number) => number < 0;
const roundNumber = (number: number) => (isNegative(number) ? Math.ceil(number) : Math.floor(number));
const absolute = (number: number) => Math.abs(number);
const getNumberUnitFormat = (number: number, unit: string) => {
  if (!number) {
    return {
      negative: false,
      format: '',
    };
  }

  if (isNegative(number)) {
    return {
      negative: true,
      format: `${absolute(number)}${unit}`,
    };
  }

  return {
    negative: false,
    format: `${number}${unit}`,
  };
};

class Duration {
  constructor(input: string | number | undefined, unit: any, locale: any) {
    (this as any).$d = {};
    (this as any).$l = locale;
    if (input === undefined) {
      (this as any).$ms = 0;
      this.parseFromMilliseconds();
    }
    if (unit) {
      return wrapper((input as any) * (unitToMS as any)[prettyUnit(unit)], this, undefined);
    }
    if (typeof input === 'number') {
      (this as any).$ms = input;
      this.parseFromMilliseconds();
      return this;
    }
    if (typeof input === 'object') {
      Object.keys(input).forEach((k) => {
        (this as any).$d[prettyUnit(k)] = input[k];
      });
      this.calMilliseconds();
      return this;
    }
    if (typeof input === 'string') {
      const d = input.match(durationRegex);
      if (d) {
        const properties = d.slice(2);
        const numberD = properties.map((value) => (value != null ? Number(value) : 0));
        [
          (this as any).$d.years,
          (this as any).$d.months,
          (this as any).$d.weeks,
          (this as any).$d.days,
          (this as any).$d.hours,
          (this as any).$d.minutes,
          (this as any).$d.seconds,
        ] = numberD;
        this.calMilliseconds();
        return this;
      }
    }
    return this;
  }

  calMilliseconds() {
    (this as any).$ms = Object.keys((this as any).$d).reduce(
      (total, unit) => total + ((this as any).$d[unit] || 0) * (unitToMS as any)[unit],
      0,
    );
  }

  parseFromMilliseconds() {
    let { $ms } = this as any;
    (this as any).$d.years = roundNumber($ms / MILLISECONDS_A_YEAR);
    $ms %= MILLISECONDS_A_YEAR;
    (this as any).$d.months = roundNumber($ms / MILLISECONDS_A_MONTH);
    $ms %= MILLISECONDS_A_MONTH;
    (this as any).$d.days = roundNumber($ms / MILLISECONDS_A_DAY);
    $ms %= MILLISECONDS_A_DAY;
    (this as any).$d.hours = roundNumber($ms / MILLISECONDS_A_HOUR);
    $ms %= MILLISECONDS_A_HOUR;
    (this as any).$d.minutes = roundNumber($ms / MILLISECONDS_A_MINUTE);
    $ms %= MILLISECONDS_A_MINUTE;
    (this as any).$d.seconds = roundNumber($ms / MILLISECONDS_A_SECOND);
    $ms %= MILLISECONDS_A_SECOND;
    (this as any).$d.milliseconds = $ms;
  }

  toISOString() {
    const Y = getNumberUnitFormat((this as any).$d.years, 'Y');
    const M = getNumberUnitFormat((this as any).$d.months, 'M');

    let days = +(this as any).$d.days || 0;
    if ((this as any).$d.weeks) {
      days += (this as any).$d.weeks * 7;
    }

    const D = getNumberUnitFormat(days, 'D');
    const H = getNumberUnitFormat((this as any).$d.hours, 'H');
    const m = getNumberUnitFormat((this as any).$d.minutes, 'M');

    let seconds = (this as any).$d.seconds || 0;
    if ((this as any).$d.milliseconds) {
      seconds += (this as any).$d.milliseconds / 1000;
    }

    const S = getNumberUnitFormat(seconds, 'S');

    const negativeMode = Y.negative || M.negative || D.negative || H.negative || m.negative || S.negative;

    const T = H.format || m.format || S.format ? 'T' : '';
    const P = negativeMode ? '-' : '';

    const result = `${P}P${Y.format}${M.format}${D.format}${T}${H.format}${m.format}${S.format}`;
    return result === 'P' || result === '-P' ? 'P0D' : result;
  }

  toJSON() {
    return this.toISOString();
  }

  format(formatStr: string) {
    const str = formatStr || 'YYYY-MM-DDTHH:mm:ss';
    const matches = {
      Y: (this as any).$d.years,
      YY: $u.s((this as any).$d.years, 2, '0'),
      YYYY: $u.s((this as any).$d.years, 4, '0'),
      M: (this as any).$d.months,
      MM: $u.s((this as any).$d.months, 2, '0'),
      D: (this as any).$d.days,
      DD: $u.s((this as any).$d.days, 2, '0'),
      H: (this as any).$d.hours,
      HH: $u.s((this as any).$d.hours, 2, '0'),
      m: (this as any).$d.minutes,
      mm: $u.s((this as any).$d.minutes, 2, '0'),
      s: (this as any).$d.seconds,
      ss: $u.s((this as any).$d.seconds, 2, '0'),
      SSS: $u.s((this as any).$d.milliseconds, 3, '0'),
    };
    return str.replace(REGEX_FORMAT, (match: string | number, $1: any) => $1 || String((matches as any)[match]));
  }

  as(unit: string) {
    return (this as any).$ms / (unitToMS as any)[prettyUnit(unit)];
  }

  get(unit: string) {
    let base = (this as any).$ms;
    const pUnit = prettyUnit(unit);
    if (pUnit === 'milliseconds') {
      base %= 1000;
    } else if (pUnit === 'weeks') {
      base = roundNumber(base / unitToMS[pUnit]);
    } else {
      base = (this as any).$d[pUnit];
    }
    return base === 0 ? 0 : base; // a === 0 will be true on both 0 and -0
  }

  add(input: number, unit: any, isSubtract: boolean) {
    let another;
    if (unit) {
      another = input * (unitToMS as any)[prettyUnit(unit)];
    } else if (isDuration(input)) {
      another = (input as any).$ms;
    } else {
      another = (wrapper(input, this, undefined) as any).$ms;
    }

    return wrapper((this as any).$ms + another * (isSubtract ? -1 : 1), this, undefined);
  }

  subtract(input: any, unit: any) {
    return this.add(input, unit, true);
  }

  locale(l: any) {
    const that = this.clone() as any;
    that.$l = l;
    return that;
  }

  clone() {
    return wrapper((this as any).$ms, this, undefined);
  }

  humanize(withSuffix: any) {
    return $d()
      .add((this as any).$ms, 'ms')
      .locale((this as any).$l)
      .fromNow(!withSuffix);
  }

  milliseconds() {
    return this.get('milliseconds');
  }
  asMilliseconds() {
    return this.as('milliseconds');
  }
  seconds() {
    return this.get('seconds');
  }
  asSeconds() {
    return this.as('seconds');
  }
  minutes() {
    return this.get('minutes');
  }
  asMinutes() {
    return this.as('minutes');
  }
  hours() {
    return this.get('hours');
  }
  asHours() {
    return this.as('hours');
  }
  days() {
    return this.get('days');
  }
  asDays() {
    return this.as('days');
  }
  weeks() {
    return this.get('weeks');
  }
  asWeeks() {
    return this.as('weeks');
  }
  months() {
    return this.get('months');
  }
  asMonths() {
    return this.as('months');
  }
  years() {
    return this.get('years');
  }
  asYears() {
    return this.as('years');
  }
}

export default (
  option: any,
  Dayjs: { prototype: { add: (value: any, unit: any) => any; subtract: (value: any, unit: any) => any } },
  dayjs: {
    (): { (): any; new (): any; $utils: { (): any; new (): any } };
    (): { (): any; new (): any; $utils: { (): any; new (): any } };
    duration: any;
    locale: any;
    isDuration: any;
  },
) => {
  $d = dayjs as any;
  $u = dayjs().$utils();
  dayjs.duration = function (input: any, unit: any) {
    const $l = dayjs.locale();
    return wrapper(input, { $l }, unit);
  };
  dayjs.isDuration = isDuration;

  const oldAdd = Dayjs.prototype.add;
  const oldSubtract = Dayjs.prototype.subtract;
  Dayjs.prototype.add = function (value: { asMilliseconds: () => any }, unit: any) {
    if (isDuration(value)) value = value.asMilliseconds();
    return oldAdd.bind(this)(value, unit);
  };
  Dayjs.prototype.subtract = function (value: { asMilliseconds: () => any }, unit: any) {
    if (isDuration(value)) value = value.asMilliseconds();
    return oldSubtract.bind(this)(value, unit);
  };
};
