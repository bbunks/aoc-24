export class Relation<T, F> {
  input: T;
  out: F;

  constructor(input: T, out: F) {
    this.input = input;
    this.out = out;
  }

  format() {
    return "(" + this.input + ", " + this.out + ")";
  }
}
