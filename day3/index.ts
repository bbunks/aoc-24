const decoder = new TextDecoder();

let puzzle1 = 0;
let puzzle2 = 0;

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

let enabled = true;

const length = input.length;
for (let i = 0; i < length; ++i) {
  if (input.startsWith("do()", i)) {
    enabled = true;
    i += 3;

    continue;
  }

  if (input.startsWith("don't()", i)) {
    enabled = false;
    i += 6;

    continue;
  }

  const reg = /^mul\((\d{1,3}),(\d{1,3})\)/;
  const testString = input.substring(i);
  const match = reg.exec(testString);
  if (match) {
    const [_, num1, num2] = match.map(parseInt);

    puzzle1 += num1 * num2;
    if (enabled) puzzle2 += num1 * num2;

    i += match[0].length;
  }
}

// Display Results
console.log("Puzzle 1:", puzzle1);
console.log("Puzzle 2:", puzzle2);
