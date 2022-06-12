export const uuid_v1 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16).toUpperCase();
  });
};

const substr = (data: string, from: number, length?: number) => {
  return data.slice(from, length ? from + length : undefined);
};

export const uuid_v2 = () => {
  const s: any[] = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = substr(hexDigits, Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  s[19] = substr(hexDigits, (s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';

  const uuid = s.join('');
  return uuid.toUpperCase();
};

export const uuid_v3 = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()).toUpperCase();
};
