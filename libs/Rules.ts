import { BRange } from "./BRange";

type LinearOperation = (term: BRange) => BRange;
type RecursiveOperation = (prevTerm: BRange, index: number) => BRange;

type LinearCase = {
  predicate: (term: number) => boolean;
  operation: LinearOperation;
  type: "linear";
};
type RecursiveCase = {
  predicate: (term: number) => boolean;
  operation: RecursiveOperation;
  type: "recursive";
};
export type Case = LinearCase | RecursiveCase;

export class Rules {
  defaultOperation: LinearOperation;
  cases: Case[];

  constructor(defaultOperation: LinearOperation) {
    this.cases = [];
    this.defaultOperation = defaultOperation;
    this.returnBRangeForTerm = this.returnBRangeForTerm.bind(this);
  }

  addLinearCase(
    predicate: (term: number) => boolean,
    operation: LinearOperation
  ) {
    this.cases.push({ predicate, operation, type: "linear" });
  }

  addRecursiveCase(
    predicate: (term: number) => boolean,
    operation: RecursiveOperation
  ) {
    this.cases.push({ predicate, operation, type: "recursive" });
  }

  translateBRange(range: BRange): BRange {
    let evaluated = range.value.map(this.returnBRangeForTerm);

    const concat = new BRange([]).concat(...evaluated);
    return concat;
  }

  returnBRangeForTerm(term: number) {
    const op = this.cases.find((rule) => rule.predicate(term));
    const subset = new BRange([term]);
    if (op?.type === "linear") {
      return op.operation(subset);
    } else if (op?.type === "recursive") {
      return op?.operation(this.returnBRangeForTerm(term - 1), term);
    } else {
      return this.defaultOperation(subset);
    }
  }
}

new Rules((val) => val);

199 * 100;
