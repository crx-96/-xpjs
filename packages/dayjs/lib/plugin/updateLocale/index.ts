export default (option: any, Dayjs: any, dayjs: { updateLocale: (locale: any, customConfig: any) => any; Ls: any }) => {
  dayjs.updateLocale = function (locale: string | number, customConfig: { [x: string]: any }) {
    const localeList = dayjs.Ls;
    const localeConfig = localeList[locale];
    if (!localeConfig) return;
    const customConfigKeys = customConfig ? Object.keys(customConfig) : [];
    customConfigKeys.forEach((c) => {
      localeConfig[c] = customConfig[c];
    });
    return localeConfig; // eslint-disable-line consistent-return
  };
};
