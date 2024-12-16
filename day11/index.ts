const decoder = new TextDecoder();

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

const initialValues = input.split(" ").map(Number);

// Global variables
let puzzle1 = 0;
let puzzle2 = 0;

// Rules
// 1. If the value is 0 it becomes a 1
// If even digits, cut the digits in half, left and right will be the halfs of the digits
//    Clean up leading 0s
// Else, multiply by 2024

function nextValue(value: number): number[] {
  if (value === 0) return [1];
  if (value.toString().length % 2 === 0) {
    const digits = value.toString().split("");
    const half = digits.length / 2;
    return [
      parseInt(digits.splice(0, half).join("")),
      parseInt(digits.join("")),
    ];
  }
  return [value * 2024];
}

const cache = new Map<string, number>();

function splitCountCheck(
  value: number,
  iterationCount: number,
  maxIterationCount: number
): number {
  // Cache key is the value and the remaining iterations
  const cacheKey = `${value}-${maxIterationCount - iterationCount}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? 0;

  const nextValues = nextValue(value);
  if (iterationCount === maxIterationCount) return nextValues.length;

  let sum = 0;
  for (const value of nextValues) {
    sum += splitCountCheck(value, iterationCount + 1, maxIterationCount);
  }

  cache.set(cacheKey, sum);
  return sum;
}

for (const value of initialValues) {
  const count = splitCountCheck(value, 1, 25);
  console.log(value, count);
  puzzle1 += count;
}

console.log("Puzzle 1:", puzzle1);

for (const value of initialValues) {
  const count = splitCountCheck(value, 1, 75);
  console.log(value, count);
  puzzle2 += count;
}

// Print the answers
console.log("Puzzle 2:", puzzle2);
