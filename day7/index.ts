const decoder = new TextDecoder();

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

const tests: { result: number; input: number[] }[] = input
  .split("\n")
  .map((e) => {
    const [result, ...input] = e.split(/:? /).map(Number);
    return { result, input };
  });

let puzzle1 = 0;
let puzzle2 = 0;

function add(a: number, b: number) {
  return a + b;
}

function mul(a: number, b: number) {
  return a * b;
}

function concat(a: number, b: number) {
  return Number(`${a}${b}`);
}

const possibleOps = [add, mul];

function testRemaining(
  currentValue: number,
  input: number[],
  neededResult: number
): boolean {
  if (input.length === 0) {
    return currentValue === neededResult;
  }

  for (let i = 0; i < possibleOps.length; i++) {
    const op = possibleOps[i];
    if (
      testRemaining(op(currentValue, input[0]), input.slice(1), neededResult)
    ) {
      return true;
    }
  }

  return false;
}

let e = tests.map(({ result, input }) => {
  return testRemaining(input[0], input.slice(1), result);
});

e.forEach((e, i) => {
  if (e) {
    puzzle1 += tests[i].result;
  }
});

// Puzzle 2
possibleOps.push(concat);

let e2 = tests.map(({ result, input }) => {
  return testRemaining(input[0], input.slice(1), result);
});

e2.forEach((e, i) => {
  if (e) {
    puzzle2 += tests[i].result;
  }
});

// Print the answers
console.log("Puzzle 1:", puzzle1);
console.log("Puzzle 2:", puzzle2);
