import { RoundingMode } from './enum/roundingMode.enum';
import { Comparison } from './enum/comparison.enum';
const Big = require('./big.js');

type BigSource = number | string | XPNumber;

interface XPBigConstructor {
  new (value: BigSource): XPNumber;
  (value: BigSource): XPNumber;
  DP: number;
  RM: number;
  NE: number;
  PE: number;
  readonly roundDown: 0;
  readonly roundHalfUp: 1;
  readonly roundHalfEven: 2;
  readonly roundUp: 3;
}

interface XPNumber {
  abs(): XPNumber;
  cmp(n: BigSource): Comparison;
  div(n: BigSource): XPNumber;
  eq(n: BigSource): boolean;
  gt(n: BigSource): boolean;
  gte(n: BigSource): boolean;
  lt(n: BigSource): boolean;
  lte(n: BigSource): boolean;
  minus(n: BigSource): XPNumber;
  mod(n: BigSource): XPNumber;
  plus(n: BigSource): XPNumber;
  pow(exp: number): XPNumber;
  prec(sd: number, rm?: RoundingMode): XPNumber;
  round(dp?: number, rm?: RoundingMode): XPNumber;
  sqrt(): XPNumber;
  times(n: BigSource): XPNumber;
  toExponential(dp?: number, rm?: RoundingMode): string;
  toFixed(dp?: number, rm?: RoundingMode): string;
  toJSON(): string;
  toNumber(): number;
  toPrecision(sd?: number, rm?: RoundingMode): string;
  toString(): string;
  valueOf(): string;
}

const XPBig: XPBigConstructor = Big as unknown as XPBigConstructor;

export default XPBig;

export * from './enum/comparison.enum';
export * from './enum/roundingMode.enum';
