import { Relation } from "./Relation";
import { RelationMap } from "./RelationMap";

export class PartialOrderRelation<T> extends RelationMap<T> {
  constructor(relations?: Relation<T, T>[]) {
    super(relations);
  }

  addRelation(input: T, out: T) {
    // Check if is reflexive
    if (this.isRelated(out, input))
      throw "A Partial Order Relation cannot have 2 elements that are equal";

    super.addRelation(input, out);
  }

  isComparable(value1: T, value2: T) {
    if (value1 === value2) return true;
    const tc = this.getTransitiveClosure();
    return tc.isRelated(value1, value2) || tc.isRelated(value2, value1);
  }

  lessThan(value1: T, value2: T) {
    if (!this.isComparable(value1, value2)) return;

    const tc = this.getTransitiveClosure();
    return tc.isRelated(value1, value2);
  }

  greaterThan(value1: T, value2: T) {
    if (!this.isComparable(value1, value2)) return;

    const tc = this.getTransitiveClosure();
    return tc.isRelated(value2, value1);
  }

  equalTo(value1: T, value2: T) {
    return value1 === value2;
  }

  lessThanOrEqualTo(value1: T, value2: T) {
    if (this.equalTo(value1, value2)) return true;
    return this.lessThan(value1, value2);
  }

  greaterThanOrEqualTo(value1: T, value2: T) {
    if (this.equalTo(value1, value2)) return true;
    return this.greaterThan(value1, value2);
  }
}
