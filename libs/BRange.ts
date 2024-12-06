import { exp } from "./BUtils.ts";

export class BRange {
  value: number[];

  constructor(value: number[]) {
    this.value = value;
  }

  formula(formula: (value: number) => number) {
    return new BRange(this.value.map((i) => formula(i)));
  }

  multiply(value: number) {
    return this.formula((i) => i * value);
  }

  add(value: number) {
    return this.formula((i) => i + value);
  }

  valueRaisedBySet(value: number) {
    return this.formula((i) => exp(value, i));
  }

  setRaisedByValue(value: number) {
    return this.formula((i) => exp(i, value));
  }

  format() {
    return "{" + this.value.join(",") + "}";
  }

  concat(...ranges: BRange[]) {
    return ranges.reduce((prev, curr) => {
      return new BRange(prev.value.concat(curr.value));
    }, this);
  }

  sum() {
    return this.value.reduce((prev, curr) => prev + curr, 0);
  }
}

export function range(lower: number, upper: number = 1) {
  const out: number[] = [];

  const increment = lower < upper ? 1 : -1;

  for (let i = lower; i !== upper + increment; i = i + increment) {
    out.push(i);
  }

  return new BRange(out);
}
