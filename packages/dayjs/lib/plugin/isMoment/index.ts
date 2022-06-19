export default (o: any, c: any, f: { isMoment: (input: any) => any; isDayjs: (arg0: any) => any }) => {
  f.isMoment = function (input: any) {
    return f.isDayjs(input);
  };
};
