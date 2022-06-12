import { RoundingMode } from './enum/roundingMode.enum';
import { Comparison } from './enum/comparison.enum';
const Big = require('./big.js');

type BigSource = number | string | XPBig;

interface XPNumberConstructor {
  new (value: BigSource): XPBig;
  (value: BigSource): XPBig;
  DP: number;
  RM: number;
  NE: number;
  PE: number;
  readonly roundDown: 0;
  readonly roundHalfUp: 1;
  readonly roundHalfEven: 2;
  readonly roundUp: 3;
}

interface XPBig {
  abs(): XPBig;
  cmp(n: BigSource): Comparison;
  div(n: BigSource): XPBig;
  eq(n: BigSource): boolean;
  gt(n: BigSource): boolean;
  gte(n: BigSource): boolean;
  lt(n: BigSource): boolean;
  lte(n: BigSource): boolean;
  minus(n: BigSource): XPBig;
  mod(n: BigSource): XPBig;
  plus(n: BigSource): XPBig;
  pow(exp: number): XPBig;
  prec(sd: number, rm?: RoundingMode): XPBig;
  round(dp?: number, rm?: RoundingMode): XPBig;
  sqrt(): XPBig;
  times(n: BigSource): XPBig;
  toExponential(dp?: number, rm?: RoundingMode): string;
  toFixed(dp?: number, rm?: RoundingMode): string;
  toJSON(): string;
  toNumber(): number;
  toPrecision(sd?: number, rm?: RoundingMode): string;
  toString(): string;
  valueOf(): string;
}

export const XPNumber: XPNumberConstructor = Big as unknown as XPNumberConstructor;
