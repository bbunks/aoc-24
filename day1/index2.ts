const decoder = new TextDecoder();

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

// Global variables
let puzzle1 = 0;
let puzzle2 = 0;

const array1: number[] = [];
const array2: number[] = [];

input
  .split("\n")
  .map((ele) => ele.split("   ").map(Number))
  .forEach((ele) => {
    array1.push(ele[0]);
    array2.push(ele[1]);
  });

// Puzzle 1
const pa1 = array1.toSorted();
const pa2 = array2.toSorted();

const frequencyMap = new Map<number, number>();

for (let i = 0; i < pa2.length; ++i) {
  if (!frequencyMap.has(pa2[i])) {
    frequencyMap.set(pa2[i], 0);
  }
  frequencyMap.set(pa2[i], frequencyMap.get(pa2[i]) + 1);
}

for (let i = 0; i < pa1.length; ++i) {
  puzzle1 += Math.abs(pa1[i] - pa2[i]);
  puzzle2 += pa1[i] * (frequencyMap.get(pa1[i]) ?? 0);
}

// Print the answers
console.log("Puzzle 1:", puzzle1);
console.log("Puzzle 2:", puzzle2);
