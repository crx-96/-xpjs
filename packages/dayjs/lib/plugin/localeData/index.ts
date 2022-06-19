import { t } from '../localizedFormat/utils';

export default (
  o: any,
  c: { prototype: any },
  dayjs: {
    Ls: { [x: string]: any };
    locale: () => string | number;
    localeData: () => {
      firstDayOfWeek: () => any;
      weekdays: () => any;
      weekdaysShort: () => any;
      weekdaysMin: () => any;
      months: () => any;
      monthsShort: () => any;
      longDateFormat: (format: any) => any;
      meridiem: any;
      ordinal: any;
    };
    weekdays: (localeOrder?: any) => any;
    weekdaysShort: (localeOrder?: any) => any;
    weekdaysMin: (localeOrder?: any) => any;
    months: () => any;
    monthsShort: () => any;
  },
) => {
  // locale needed later
  const proto = c.prototype;
  const getLocalePart = (part: { indexOf: any; s: any }) => part && (part.indexOf ? part : part.s);
  const getShort = (
    ins: { name: any; $locale: () => any },
    target: string,
    full?: string | null | undefined,
    num?: number | null | undefined,
    localeOrder?: undefined,
  ) => {
    const locale = ins.name ? ins : ins.$locale();
    const targetLocale = getLocalePart(locale[target]);
    const fullLocale = getLocalePart(locale[full as any]);
    const result = targetLocale || fullLocale.map((f: string | any[]) => f.slice(0, num as any));
    if (!localeOrder) return result;
    const { weekStart } = locale;
    return result.map((_: any, index: any) => result[(index + (weekStart || 0)) % 7]);
  };
  const getDayjsLocaleObject = () => dayjs.Ls[dayjs.locale()];
  const getLongDateFormat = (l: { formats: { [x: string]: string } }, format: string) =>
    l.formats[format] || t(l.formats[format.toUpperCase()]);

  const localeData = function (this: any) {
    return {
      months: (instance: { format: (arg0: string) => any }) =>
        instance ? instance.format('MMMM') : getShort(this, 'months'),
      monthsShort: (instance: { format: (arg0: string) => any }) =>
        instance ? instance.format('MMM') : getShort(this, 'monthsShort', 'months', 3),
      firstDayOfWeek: () => this.$locale().weekStart || 0,
      weekdays: (instance: { format: (arg0: string) => any }) =>
        instance ? instance.format('dddd') : getShort(this, 'weekdays'),
      weekdaysMin: (instance: { format: (arg0: string) => any }) =>
        instance ? instance.format('dd') : getShort(this, 'weekdaysMin', 'weekdays', 2),
      weekdaysShort: (instance: { format: (arg0: string) => any }) =>
        instance ? instance.format('ddd') : getShort(this, 'weekdaysShort', 'weekdays', 3),
      longDateFormat: (format: any) => getLongDateFormat(this.$locale(), format),
      meridiem: this.$locale().meridiem,
      ordinal: this.$locale().ordinal,
    };
  };
  proto.localeData = function () {
    return localeData.bind(this)();
  };

  dayjs.localeData = () => {
    const localeObject = getDayjsLocaleObject();
    return {
      firstDayOfWeek: () => localeObject.weekStart || 0,
      weekdays: () => dayjs.weekdays(),
      weekdaysShort: () => dayjs.weekdaysShort(),
      weekdaysMin: () => dayjs.weekdaysMin(),
      months: () => dayjs.months(),
      monthsShort: () => dayjs.monthsShort(),
      longDateFormat: (format: any) => getLongDateFormat(localeObject, format),
      meridiem: localeObject.meridiem,
      ordinal: localeObject.ordinal,
    };
  };

  dayjs.months = () => getShort(getDayjsLocaleObject(), 'months');

  dayjs.monthsShort = () => getShort(getDayjsLocaleObject(), 'monthsShort', 'months', 3);

  dayjs.weekdays = (localeOrder: any) => getShort(getDayjsLocaleObject(), 'weekdays', null, null, localeOrder);

  dayjs.weekdaysShort = (localeOrder: any) =>
    getShort(getDayjsLocaleObject(), 'weekdaysShort', 'weekdays', 3, localeOrder);

  dayjs.weekdaysMin = (localeOrder: any) => getShort(getDayjsLocaleObject(), 'weekdaysMin', 'weekdays', 2, localeOrder);
};
