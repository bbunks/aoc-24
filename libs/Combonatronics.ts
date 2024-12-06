import { range } from "./BRange.ts";

export function factorial(upper: number, lower: number = 0) {
  return range(lower + 1, upper).value.reduce((p, v) => p * v, 1);
}

export function getSubsetCount(setSize: number, subsetSize: number) {
  return factorial(setSize, setSize - subsetSize) / factorial(subsetSize);
}

export function getPermutationCount(setSize: number, subsetSize: number) {
  return factorial(setSize) / factorial(setSize - subsetSize);
}

export function getPowerSet<T>(set: T[]): T[][] {
  const subset = set.slice(1);
  if (set.length === 0) return [[]];
  const po = getPowerSet(subset);
  const pp = po.map((s) => [...s, set[0]]);
  return [...po, ...pp];
}

export function getMultisetCombonationCount(
  combonationSize: number,
  varietyCount: number
) {
  return (
    factorial(varietyCount + combonationSize - 1, varietyCount - 1) /
    factorial(combonationSize)
  );
}

export function getAllCombonations(...sets: any[][]) {
  let out: any[][] = [[]];

  function appendNextSet(sets: any[][]) {
    const newOut: any[][] = [];

    if (sets.length === 0) return;

    out.forEach((starterList) => {
      sets[0].forEach((mv) => {
        newOut.push([...starterList, mv]);
      });
    });

    if (sets.length > 0) {
      out = newOut;
      appendNextSet(sets.slice(1));
    }
  }

  appendNextSet(sets);

  return out;
}

export function getDistribution<T, K>(sets: T[][], reducer: (set: T[]) => K) {
  const outMap = new Map<K, number>();

  sets.forEach((set) => {
    const k = reducer(set);
    outMap.set(k, (outMap.get(k) ?? 0) + 1);
  });

  return [...outMap.entries()].map((v) => [v[0], v[1] / sets.length]);
}
