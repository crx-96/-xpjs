import * as C from './constant';
import en from './locale/en';
import { ILocale } from './locale/type';
import U from './utils';
import UTC from './plugin/utc/index';

let L = 'en'; // global locale
const Ls: { [key: string]: ILocale } = {}; // global loaded locale
Ls[L] = en;

interface ConfigTypeMap {
  default: string | number | Date | Dayjs | null | undefined;
}

export type ConfigType = ConfigTypeMap[keyof ConfigTypeMap];

export interface FormatObject {
  locale?: string;
  format?: string;
  utc?: boolean;
}

export type OptionType = FormatObject | string | string[];

export type UnitTypeShort = 'd' | 'D' | 'M' | 'y' | 'h' | 'm' | 's' | 'ms';

export type UnitTypeLong = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' | 'date';

export type UnitTypeLongPlural =
  | 'milliseconds'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'months'
  | 'years'
  | 'dates';

export type UnitType = UnitTypeLong | UnitTypeLongPlural | UnitTypeShort;

export type OpUnitType = UnitType | 'week' | 'weeks' | 'w';
export type QUnitType = UnitType | 'quarter' | 'quarters' | 'Q';
export type ManipulateType = Exclude<OpUnitType, 'date' | 'dates'>;

const isDayjs = (d: any) => d instanceof Dayjs; // eslint-disable-line no-use-before-define

const parseLocale = (preset?: any, object?: any, isLocal?: any): any => {
  let l;
  if (!preset) return L;
  if (typeof preset === 'string') {
    const presetLower = preset.toLowerCase();
    if (Ls[presetLower]) {
      l = presetLower;
    }
    if (object) {
      Ls[presetLower] = object;
      l = presetLower;
    }
    const presetSplit = preset.split('-');
    if (!l && presetSplit.length > 1) {
      return parseLocale(presetSplit[0]);
    }
  } else {
    const { name } = preset;
    Ls[name] = preset;
    l = name;
  }
  if (!isLocal && l) L = l;
  return l || (!isLocal && L);
};

const dayjs = function (date?: ConfigType, c?: any) {
  if (isDayjs(date)) {
    return (date as Dayjs).clone();
  }
  // eslint-disable-next-line no-nested-ternary
  const cfg = typeof c === 'object' ? c : {};
  cfg.date = date;
  cfg.args = arguments; // eslint-disable-line prefer-rest-params
  return new Dayjs(cfg); // eslint-disable-line no-use-before-define
};

const wrapper = (date: any, instance: any) =>
  dayjs(date, {
    locale: instance.$L,
    utc: instance.$u,
    x: instance.$x,
    $offset: instance.$offset, // todo: refactor; do not use this.$offset in you code
  });

const Utils: any = U; // for plugin use
Utils.l = parseLocale;
Utils.i = isDayjs;
Utils.w = wrapper;

const parseDate = (cfg: any) => {
  const { date, utc } = cfg;
  if (date === null) return new Date(NaN); // null is invalid
  if (Utils.u(date)) return new Date(); // today
  if (date instanceof Date) return new Date(date);
  if (typeof date === 'string' && !/Z$/i.test(date)) {
    const d: any = date.match(C.REGEX_PARSE);
    if (d) {
      const m = d[2] - 1 || 0;
      const ms = (d[7] || '0').substring(0, 3);
      if (utc) {
        return new Date(Date.UTC(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms));
      }
      return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
    }
  }

  return new Date(date); // everything else
};

class Dayjs {
  constructor(cfg: ConfigType) {
    (this as any).$L = parseLocale((cfg as Dayjs).locale, null, true);
    this.parse(cfg); // for plugin
  }

  parse(cfg: any) {
    (this as any).$d = parseDate(cfg);
    (this as any).$x = cfg.x || {};
    this.init();
  }

  init() {
    const { $d } = this as any;
    (this as any).$y = $d.getFullYear();
    (this as any).$M = $d.getMonth();
    (this as any).$D = $d.getDate();
    (this as any).$W = $d.getDay();
    (this as any).$H = $d.getHours();
    (this as any).$m = $d.getMinutes();
    (this as any).$s = $d.getSeconds();
    (this as any).$ms = $d.getMilliseconds();
  }

  // eslint-disable-next-line class-methods-use-this
  $utils() {
    return Utils;
  }

  isValid(): boolean {
    return !((this as any).$d.toString() === C.INVALID_DATE_STRING);
  }

  isSame(that: ConfigType, units: OpUnitType): boolean {
    const other = dayjs(that);
    return this.startOf(units) <= other && other <= this.endOf(units);
  }

  isAfter(that: ConfigType, units: OpUnitType): boolean {
    return dayjs(that) < this.startOf(units);
  }

  isBefore(that: ConfigType, units: OpUnitType): boolean {
    return this.endOf(units) < dayjs(that);
  }

  $g(input: any, get: any, set: any): any {
    if (Utils.u(input)) return (this as any)[get];
    return this.set(set, input);
  }

  unix(): number {
    return Math.floor(this.valueOf() / 1000);
  }

  valueOf(): number {
    // timezone(hour) * 60 * 60 * 1000 => ms
    return (this as any).$d.getTime();
  }

  startOf(units: OpUnitType, startOf = true) {
    // startOf -> endOf
    const isStartOf = !Utils.u(startOf) ? startOf : true;
    const unit = Utils.p(units);
    const instanceFactory = (d: number | undefined, m: number) => {
      const ins = Utils.w((this as any).$u ? Date.UTC((this as any).$y, m, d) : new Date((this as any).$y, m, d), this);
      return isStartOf ? ins : ins.endOf(C.D);
    };
    const instanceFactorySet = (method: string, slice: number | undefined) => {
      const argumentStart = [0, 0, 0, 0];
      const argumentEnd = [23, 59, 59, 999];
      return Utils.w(
        (this as any).toDate()[method].apply(
          // eslint-disable-line prefer-spread
          this.toDate('s'),
          (isStartOf ? argumentStart : argumentEnd).slice(slice),
        ),
        this,
      );
    };
    const { $W, $M, $D } = this as any;
    const utcPad = `set${(this as any).$u ? 'UTC' : ''}`;
    switch (unit) {
      case C.Y:
        return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);
      case C.M:
        return isStartOf ? instanceFactory(1, $M) : instanceFactory(0, $M + 1);
      case C.W: {
        const weekStart = this.$locale().weekStart || 0;
        const gap = ($W < weekStart ? $W + 7 : $W) - weekStart;
        return instanceFactory(isStartOf ? $D - gap : $D + (6 - gap), $M);
      }
      case C.D:
      case C.DATE:
        return instanceFactorySet(`${utcPad}Hours`, 0);
      case C.H:
        return instanceFactorySet(`${utcPad}Minutes`, 1);
      case C.MIN:
        return instanceFactorySet(`${utcPad}Seconds`, 2);
      case C.S:
        return instanceFactorySet(`${utcPad}Milliseconds`, 3);
      default:
        return this.clone();
    }
  }

  endOf(arg: OpUnitType) {
    return this.startOf(arg, false);
  }

  $set(units: any, int: number) {
    // private set
    const unit = Utils.p(units);
    const utcPad = `set${(this as any).$u ? 'UTC' : ''}`;
    const name: any = {
      [(C as any).D]: `${utcPad}Date`,
      [(C as any).DATE]: `${utcPad}Date`,
      [(C as any).M]: `${utcPad}Month`,
      [(C as any).Y]: `${utcPad}FullYear`,
      [(C as any).H]: `${utcPad}Hours`,
      [(C as any).MIN]: `${utcPad}Minutes`,
      [(C as any).S]: `${utcPad}Seconds`,
      [(C as any).MS]: `${utcPad}Milliseconds`,
    }[unit];
    const arg = unit === C.D ? (this as any).$D + (int - (this as any).$W) : int;

    if (unit === C.M || unit === C.Y) {
      // clone is for badMutable plugin
      const date = this.clone().set(C.DATE, 1);
      date.$d[name](arg);
      date.init();
      (this as any).$d = date.set(C.DATE, Math.min((this as any).$D, date.daysInMonth())).$d;
    } else if (name) (this as any).$d[name](arg);

    this.init();
    return this;
  }

  set(string: UnitType, int: number) {
    return this.clone().$set(string, int);
  }

  get(unit: UnitType) {
    return (this as any)[Utils.p(unit)]();
  }

  add(number: number, units?: ManipulateType) {
    number = Number(number); // eslint-disable-line no-param-reassign
    const unit = Utils.p(units);
    const instanceFactorySet = (n: number) => {
      const d = dayjs(this);
      return Utils.w(d.date(d.date() + Math.round(n * number)), this);
    };
    if (unit === C.M) {
      return this.set(C.M, (this as any).$M + number);
    }
    if (unit === C.Y) {
      return this.set(C.Y, (this as any).$y + number);
    }
    if (unit === C.D) {
      return instanceFactorySet(1);
    }
    if (unit === C.W) {
      return instanceFactorySet(7);
    }
    const step: any =
      {
        [(C as any).MIN]: C.MILLISECONDS_A_MINUTE,
        [(C as any).H]: C.MILLISECONDS_A_HOUR,
        [(C as any).S]: C.MILLISECONDS_A_SECOND,
      }[unit] || 1; // ms

    const nextTimeStamp = (this as any).$d.getTime() + number * step;
    return Utils.w(nextTimeStamp, this);
  }

  subtract(number: number, string?: ManipulateType) {
    return this.add(number * -1, string);
  }

  format(formatStr?: string) {
    const locale = this.$locale();

    if (!this.isValid()) return (locale as any).invalidDate || C.INVALID_DATE_STRING;

    const str = formatStr || C.FORMAT_DEFAULT;
    const zoneStr = Utils.z(this);
    const { $H, $m, $M } = this as any;
    const { weekdays, months, meridiem } = locale as any;
    const getShort = (arr: any, index: string | number, full?: any, length?: number | undefined) =>
      (arr && (arr[index] || arr(this, str))) || full[index].slice(0, length);
    const get$H = (num: number) => Utils.s($H % 12 || 12, num, '0');

    const meridiemFunc =
      meridiem ||
      ((hour: number, minute: any, isLowercase: any) => {
        const m = hour < 12 ? 'AM' : 'PM';
        return isLowercase ? m.toLowerCase() : m;
      });

    const matches: any = {
      YY: String((this as any).$y).slice(-2),
      YYYY: (this as any).$y,
      M: $M + 1,
      MM: Utils.s($M + 1, 2, '0'),
      MMM: getShort(locale.monthsShort, $M, months, 3),
      MMMM: getShort(months, $M),
      D: (this as any).$D,
      DD: Utils.s((this as any).$D, 2, '0'),
      d: String((this as any).$W),
      dd: getShort(locale.weekdaysMin, (this as any).$W, weekdays, 2),
      ddd: getShort(locale.weekdaysShort, (this as any).$W, weekdays, 3),
      dddd: weekdays[(this as any).$W],
      H: String($H),
      HH: Utils.s($H, 2, '0'),
      h: get$H(1),
      hh: get$H(2),
      a: meridiemFunc($H, $m, true),
      A: meridiemFunc($H, $m, false),
      m: String($m),
      mm: Utils.s($m, 2, '0'),
      s: String((this as any).$s),
      ss: Utils.s((this as any).$s, 2, '0'),
      SSS: Utils.s((this as any).$ms, 3, '0'),
      Z: zoneStr, // 'ZZ' logic below
    };

    return str.replace(C.REGEX_FORMAT, (match, $1) => $1 || matches[match] || zoneStr.replace(':', '')); // 'ZZ'
  }

  utcOffset() {
    // Because a bug at FF24, we're rounding the timezone offset around 15 minutes
    // https://github.com/moment/moment/pull/1871
    return -Math.round((this as any).$d.getTimezoneOffset() / 15) * 15;
  }

  diff(input: string | number | Date | Dayjs | null | undefined, units: any, float: any) {
    const unit = Utils.p(units);
    const that = dayjs(input);
    const zoneDelta = (that.utcOffset() - this.utcOffset()) * C.MILLISECONDS_A_MINUTE;
    const diff = (this as any) - that;
    let result: any = Utils.m(this, that);

    result =
      {
        [(C as any).Y]: result / 12,
        [(C as any).M]: result,
        [(C as any).Q]: result / 3,
        [(C as any).W]: (diff - zoneDelta) / C.MILLISECONDS_A_WEEK,
        [C.D]: (diff - zoneDelta) / C.MILLISECONDS_A_DAY,
        [C.H]: diff / C.MILLISECONDS_A_HOUR,
        [C.MIN]: diff / C.MILLISECONDS_A_MINUTE,
        [C.S]: diff / C.MILLISECONDS_A_SECOND,
      }[unit] || diff; // milliseconds

    return float ? result : Utils.a(result);
  }

  daysInMonth() {
    return this.endOf(C.M).$D;
  }

  $locale() {
    // get locale object
    return Ls[(this as any).$L];
  }

  locale(preset: any, object: any) {
    if (!preset) return (this as any).$L;
    const that = this.clone();
    const nextLocaleName = parseLocale(preset, object, true);
    if (nextLocaleName) that.$L = nextLocaleName;
    return that;
  }

  clone() {
    return Utils.w((this as any).$d, this);
  }

  toDate(s?: any) {
    return new Date(this.valueOf());
  }

  toJSON() {
    return this.isValid() ? this.toISOString() : null;
  }

  toISOString() {
    // ie 8 return
    // new Dayjs(this.valueOf() + this.$d.getTimezoneOffset() * 60000)
    // .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    return (this as any).$d.toISOString();
  }

  toString() {
    return (this as any).$d.toUTCString();
  }
}

const proto = Dayjs.prototype;
dayjs.prototype = proto;
[
  ['$ms', C.MS],
  ['$s', C.S],
  ['$m', C.MIN],
  ['$H', C.H],
  ['$W', C.D],
  ['$M', C.M],
  ['$y', C.Y],
  ['$D', C.DATE],
].forEach((g) => {
  (proto as any)[g[1]] = function (input: any) {
    return this.$g(input, g[0], g[1]);
  };
});

dayjs.extend = (plugin: any, option: any) => {
  if (!plugin.$i) {
    // install plugin only once
    plugin(option, Dayjs, dayjs);
    plugin.$i = true;
  }
  return dayjs;
};

dayjs.locale = parseLocale;

dayjs.isDayjs = isDayjs;

dayjs.unix = (timestamp: number) => dayjs(timestamp * 1e3);

dayjs.en = Ls[L];
dayjs.Ls = Ls;
dayjs.p = {};
dayjs.extend(UTC, null);

export type PluginFunc<T = unknown> = (option: T, c?: any, d?: any) => void;

interface DayjsConstructor {
  (date?: ConfigType): DayjsExample;
  (date?: ConfigType, format?: OptionType, strict?: boolean): DayjsExample;
  (date?: ConfigType, format?: OptionType, locale?: string, strict?: boolean): DayjsExample;
  new (date?: ConfigType): DayjsExample;
  new (date?: ConfigType, format?: OptionType, strict?: boolean): DayjsExample;
  new (date?: ConfigType, format?: OptionType, locale?: string, strict?: boolean): DayjsExample;
  extend<T = unknown>(plugin: PluginFunc<T>, option?: T): DayjsExample;
  locale(preset?: string | ILocale, object?: Partial<ILocale>, isLocal?: boolean): string;
  isDayjs(d: any): d is DayjsExample;
  unix(t: number): DayjsExample;
  utc(date?: ConfigType): DayjsExample;
  utc(date?: ConfigType, format?: OptionType, strict?: boolean): DayjsExample;
  utc(date?: ConfigType, format?: OptionType, locale?: string, strict?: boolean): DayjsExample;
}

interface DayjsExample {
  clone(): DayjsExample;

  isValid(): boolean;

  year(): number;

  year(value: number): DayjsExample;

  month(): number;

  month(value: number): DayjsExample;

  date(): number;

  date(value: number): DayjsExample;

  day(): number;

  day(value: number): DayjsExample;

  hour(): number;

  hour(value: number): DayjsExample;

  minute(): number;

  minute(value: number): DayjsExample;

  second(): number;

  second(value: number): DayjsExample;

  millisecond(): number;

  millisecond(value: number): DayjsExample;

  set(unit: UnitType, value: number): DayjsExample;

  get(unit: UnitType): number;

  add(value: number, unit?: ManipulateType): DayjsExample;

  subtract(value: number, unit?: ManipulateType): DayjsExample;

  startOf(unit: OpUnitType): DayjsExample;

  endOf(unit: OpUnitType): DayjsExample;

  format(template?: string): string;

  diff(date?: ConfigType, unit?: QUnitType | OpUnitType, float?: boolean): number;

  valueOf(): number;

  unix(): number;

  daysInMonth(): number;

  toDate(): Date;

  toJSON(): string;

  toISOString(): string;

  toString(): string;

  utcOffset(): number;

  isBefore(date: ConfigType, unit?: OpUnitType): boolean;

  isSame(date: ConfigType, unit?: OpUnitType): boolean;

  isAfter(date: ConfigType, unit?: OpUnitType): boolean;

  locale(): string;

  locale(preset: string | ILocale, object?: Partial<ILocale>): DayjsExample;

  utc(): DayjsExample;
  isUTC(): boolean;
  local(): DayjsExample;

  // 继承方法
  [index: string]: Function;
}

const dayjsFn: DayjsConstructor = dayjs as unknown as DayjsConstructor;

export default dayjsFn;
