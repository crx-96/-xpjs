export const t = (format: string) =>
  format.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (_: any, a: any, b: string | any[]) => a || b.slice(1));

export const englishFormats: any = {
  LTS: 'h:mm:ss A',
  LT: 'h:mm A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A',
};

export const u = (formatStr: string, formats: { [x: string]: any }) =>
  formatStr.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (_: any, a: any, b: string) => {
    const B = b && b.toUpperCase();
    return a || formats[b] || englishFormats[b] || t(formats[B]);
  });
