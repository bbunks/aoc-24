import { range } from "./BRange";
import { reverse } from "./BUtils";

export function getNextPermutation(input: number[]): number[] {
  const out = [...input];

  // find the index of the last term that is less than the next term.
  const p1index =
    input.length -
    1 -
    reverse(input).findIndex((v, i, a) => {
      if (i === 0) return false;
      return v < a[i - 1];
    });

  if (p1index === -1)
    throw new Error("There is no value greater than the input given");

  // find the smallest number that is after number found above
  let p2index: number | undefined;
  for (let i = p1index + 1; i < input.length; i++) {
    if (p2index === undefined) {
      if (input[i] > input[p1index]) {
        p2index = i;
      }
      continue;
    }
    if (input[i] > input[p1index] && input[p1index] < input[p2index])
      p2index = i;
  }

  // swap the 2 values
  if (p2index !== undefined) {
    let temp = out[p2index];
    out[p2index] = out[p1index];
    out[p1index] = temp;
  }

  //reorder everything after p1 in ascending order
  const arr1 = out.slice(0, p1index + 1);
  const arr2 = reverse(out.slice(p1index + 1));
  return [...arr1, ...arr2];
}

export function getLexPermutations<T>(orderedSet: T[]) {
  function lp(length: number, out: number[][]) {
    let orderedIndexed = range(0, length - 1).value;
    let finalEntry = JSON.stringify(range(length - 1, 0).value);
    out.push(orderedIndexed);

    while (JSON.stringify(orderedIndexed) !== finalEntry) {
      orderedIndexed = getNextPermutation(orderedIndexed);
      out.push(orderedIndexed);
    }
  }

  const out: number[][] = [];
  lp(orderedSet.length, out);
  const translated = out.map((p) => p.map((i) => orderedSet[i]));
  return translated;
}

// -1 means a is less than b, 1 means b is less than a, and 0 means they are equivalent
export function comparePermutations(setA: number[], setB: number[]) {
  const sortedA = [...setA];
  const sortedB = [...setB];

  let i = 0;
  while (sortedA[i] === sortedB[i]) {
    if (i === sortedA.length && i === sortedB.length) {
      return 0;
    }
    if (i + 1 === sortedA.length) return -1;
    if (i + 1 === sortedB.length) return 1;

    i++;
  }

  if (sortedA[i] !== sortedB[i]) {
    return sortedA[i] > sortedB[i] ? 1 : -1;
  }

  return 0;
}

// -1 means a is less than b, 1 means b is less than a, and 0 means they are equivalent
export function compareSets(setA: number[], setB: number[]) {
  const sortedA = [...setA].sort((a, b) => a - b);
  const sortedB = [...setB].sort((a, b) => a - b);

  let i = 0;
  while (sortedA[i] === sortedB[i]) {
    if (i === sortedA.length && i === sortedB.length) {
      return 0;
    }
    if (i + 1 === sortedA.length) return -1;
    if (i + 1 === sortedB.length) return 1;

    i++;
  }

  if (sortedA[i] !== sortedB[i]) {
    return sortedA[i] > sortedB[i] ? 1 : -1;
  }

  return 0;
}

export function getNextSubset(input: number[], maxValue: number) {
  const pivot =
    input.length -
    1 -
    reverse([...input].sort((a, b) => a - b)).findIndex(
      (v, i) => v < maxValue - i
    );
  const out = input.slice(0, pivot);
  pivot;
  out.push(
    ...range(input[pivot] + 1, input[pivot] + input.length - pivot).value
  );
  return out;
}

export function getLexSubsets<T>(orderedSet: T[], subsetSize: number) {
  const out: number[][] = [];

  let start = range(0, subsetSize - 1).value;
  let finalEntry = JSON.stringify(
    range(orderedSet.length - subsetSize, orderedSet.length - 1).value
  );

  out.push(start);

  while (JSON.stringify(start) !== finalEntry) {
    start = getNextSubset(start, orderedSet.length - 1);
    out.push(start);
  }

  const translated = out.map((p) => p.map((i) => orderedSet[i]));
  return translated;
}
