import { MILLISECONDS_A_MINUTE, MIN } from '../../constant';

const REGEX_VALID_OFFSET_FORMAT = /[+-]\d\d(?::?\d\d)?/g;
const REGEX_OFFSET_HOURS_MINUTES_FORMAT = /([+-]|\d\d)/g;

function offsetFromString(value = '') {
  const offset = value.match(REGEX_VALID_OFFSET_FORMAT);

  if (!offset) {
    return null;
  }

  const [indicator, hoursOffset, minutesOffset] = `${offset[0]}`.match(REGEX_OFFSET_HOURS_MINUTES_FORMAT) || [
    '-',
    0,
    0,
  ];
  const totalOffsetInMinutes = +hoursOffset * 60 + +minutesOffset;

  if (totalOffsetInMinutes === 0) {
    return 0;
  }

  return indicator === '+' ? totalOffsetInMinutes : -totalOffsetInMinutes;
}

export default (
  option: any,
  Dayjs: { new (arg0: { date: any; utc: boolean; args: IArguments }): any; prototype: any },
  dayjs: {
    (arg0: any, arg1: { locale: any; utc: boolean } | undefined): {
      (): any;
      new (): any;
      toDate: { (): any; new (): any };
      local: { (): any; new (): any };
    };
    (arg0: any, arg1: { locale: any; utc: boolean } | undefined): {
      (): any;
      new (): any;
      toDate: { (): any; new (): any };
      local: { (): any; new (): any };
    };
    utc: any;
  },
) => {
  const proto = Dayjs.prototype;
  dayjs.utc = function (date: any) {
    const cfg = { date, utc: true, args: arguments }; // eslint-disable-line prefer-rest-params
    return new Dayjs(cfg); // eslint-disable-line no-use-before-define
  };

  proto.utc = function (keepLocalTime: any) {
    const ins = dayjs(this.toDate(), { locale: this.$L, utc: true }) as any;
    if (keepLocalTime) {
      return ins.add(this.utcOffset(), MIN);
    }
    return ins;
  };

  proto.local = function () {
    return dayjs(this.toDate(), { locale: this.$L, utc: false });
  };

  const oldParse = proto.parse;
  proto.parse = function (cfg: { utc: any; $offset: any }) {
    if (cfg.utc) {
      this.$u = true;
    }
    if (!this.$utils().u(cfg.$offset)) {
      this.$offset = cfg.$offset;
    }
    oldParse.call(this, cfg);
  };

  const oldInit = proto.init;
  proto.init = function () {
    if (this.$u) {
      const { $d } = this;
      this.$y = $d.getUTCFullYear();
      this.$M = $d.getUTCMonth();
      this.$D = $d.getUTCDate();
      this.$W = $d.getUTCDay();
      this.$H = $d.getUTCHours();
      this.$m = $d.getUTCMinutes();
      this.$s = $d.getUTCSeconds();
      this.$ms = $d.getUTCMilliseconds();
    } else {
      oldInit.call(this);
    }
  };

  const oldUtcOffset = proto.utcOffset;
  proto.utcOffset = function (input: string | number | null | undefined, keepLocalTime: any) {
    const { u } = this.$utils();
    if (u(input)) {
      if (this.$u) {
        return 0;
      }
      if (!u(this.$offset)) {
        return this.$offset;
      }
      return oldUtcOffset.call(this);
    }
    if (typeof input === 'string') {
      input = offsetFromString(input);
      if (input === null) {
        return this;
      }
    }
    const offset = Math.abs(input as any) <= 16 ? (input as any) * 60 : input;
    let ins = this;
    if (keepLocalTime) {
      ins.$offset = offset;
      ins.$u = input === 0;
      return ins;
    }
    if (input !== 0) {
      const localTimezoneOffset = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
      ins = this.local().add(offset + localTimezoneOffset, MIN);
      ins.$offset = offset;
      ins.$x.$localOffset = localTimezoneOffset;
    } else {
      ins = this.utc();
    }
    return ins;
  };

  const oldFormat = proto.format;
  const UTC_FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ss[Z]';
  proto.format = function (formatStr: string) {
    const str = formatStr || (this.$u ? UTC_FORMAT_DEFAULT : '');
    return oldFormat.call(this, str);
  };

  proto.valueOf = function () {
    const addedOffset = !this.$utils().u(this.$offset)
      ? this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset())
      : 0;
    return this.$d.valueOf() - addedOffset * MILLISECONDS_A_MINUTE;
  };

  proto.isUTC = function () {
    return !!this.$u;
  };

  proto.toISOString = function () {
    return this.toDate().toISOString();
  };

  proto.toString = function () {
    return this.toDate().toUTCString();
  };

  const oldToDate = proto.toDate;
  proto.toDate = function (type: string) {
    if (type === 's' && this.$offset) {
      return (dayjs as any)(this.format('YYYY-MM-DD HH:mm:ss:SSS')).toDate();
    }
    return oldToDate.call(this);
  };
  const oldDiff = proto.diff;
  proto.diff = function (input: { $u: any }, units: any, float: any) {
    if (input && this.$u === input.$u) {
      return oldDiff.call(this, input, units, float);
    }
    const localThis = this.local();
    const localInput = (dayjs as any)(input).local();
    return oldDiff.call(localThis, localInput, units, float);
  };
};
