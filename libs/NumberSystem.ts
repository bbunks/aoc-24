import { exp } from "./BUtils";

const numberSystem = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

numberSystem.slice(10); //=

export function swapBase(value: string, ogBase: number, newBase: number) {
  const baseBreak = value.split("").reverse();
  let base10 = baseBreak
    .map((digit, place) => {
      const decDigitValue = numberSystem.indexOf(digit);
      return decDigitValue * exp(ogBase, place);
    })
    .reduce((p, c) => p + c, 0);

  return base10;
}

export class BasedNumber {
  value: number[];
  base: number;
  numberSystem: string[];

  constructor(value: string, base: number) {
    this.base = base;
    this.numberSystem = numberSystem.slice(0, base);
    const baseBreak = value.split("").reverse();

    this.value = baseBreak.map((digit, place) => {
      const decDigitValue = this.numberSystem.indexOf(digit);
      if (decDigitValue === -1)
        throw new Error("A digit does not live in the base provided");
      return decDigitValue;
    });
    this.inc = this.inc.bind(this);
  }

  toString() {
    const charMap = this.value.map((v) => this.numberSystem[v]).reverse();
    return charMap.join("");
  }

  inc() {
    const bumpFirst = (value: number[], base: number, startingPos: number) => {
      if (value[startingPos] === this.base - 1) {
        value[startingPos] = 0;
        if (value.length === 1) {
          value.push(1);
        } else {
          bumpFirst(value, base, startingPos + 1);
        }
      } else {
        value[startingPos] += 1;
      }
    };

    bumpFirst(this.value, this.base, 0);

    return this;
  }

  toBase(base: number) {
    const newValue: number[] = [];

    let q = this.value.reduce((p, c, i) => p + c * exp(this.base, i), 0);

    while (q > 0) {
      newValue.unshift(q % base);
      q = Math.floor(q / base);
    }

    const charMap = newValue.map((v) => numberSystem[v]);
    return new BasedNumber(charMap.join(""), base);
  }
}
