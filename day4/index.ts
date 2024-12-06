import { Matrix } from "../libs/Matrix.ts";

try {
  Deno.removeSync("log.txt");
} catch (e) {}

function log(...args: unknown[]) {
  const encoder = new TextEncoder();
  const data = encoder.encode(args.join(" ") + "\n");
  Deno.writeFileSync("log.txt", data, { append: true });
}

const decoder = new TextDecoder();

let puzzle1 = 0;
let puzzle2 = 0;

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

const arr = input.split("\n").map((e) => e.split(""));
const width = arr[0].length;
const height = arr.length;
const flat = arr.flat();
const flatString = flat.join("");

let matrix = new Matrix(arr.map((e) => e.map((e) => 0)));
function checkDirection(
  i: number,
  j: number,
  x: number,
  y: number,
  word: string
) {
  const wordLength = word.length;

  if (i + y * (wordLength - 1) < 0) {
    log(word, i, j, x, y, "underheight");
    return false;
  } else if (i + y * wordLength > height) {
    log(word, i, j, x, y, "overheight", i + y * (wordLength - 1));
    return false;
  }

  if (j + x * wordLength > width || j + x * (wordLength - 1) < 0) {
    log(word, i, j, x, y, "overwidth");
    return false;
  }

  for (let k = 0; k < wordLength; k++) {
    if (arr[i + y * k][j + x * k] !== word[k]) {
      log(
        word,
        i,
        j,
        x,
        y,
        k,
        arr[i + y * k][j + x * k],
        word[k],
        "wrong letter"
      );
      return false;
    }
  }

  for (let k = 0; k < wordLength; k++) {
    matrix.setValueAtCords(j + x * k, i + y * k, 1);
  }

  log(word, i, j, x, y, "correct");
  return true;
}

const directions = [
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
  [0, 1],
  [0, -1],
];

for (let i = 0; i < width; i++) {
  for (let j = 0; j < height; j++) {
    for (const [x, y] of directions) {
      if (checkDirection(i, j, x, y, "XMAS")) {
        puzzle1++;
      }
    }
  }
}

const puzzle1Mask = matrix;

log("============================================================");

const line1Directions = [
  [1, 1],
  [-1, -1],
];

const line2Directions = [
  [-1, 1],
  [1, -1],
];

matrix = new Matrix(arr.map((e) => e.map((e) => 0)));
let b = false;
for (let i = 1; i < height - 1; i++) {
  for (let j = 1; j < width - 1; j++) {
    log("i", i, "j", j);
    line1Directions.forEach(([x1, y1]) => {
      if (checkDirection(i - x1, j - y1, x1, y1, "MAS"))
        line2Directions.forEach(([x2, y2]) => {
          if (checkDirection(i - y2, j - x2, x2, y2, "MAS")) {
            log("correct");
            puzzle2++;
          }
        });
    });
  }
}

let masked = arr.map((e) => e.map(() => "."));

puzzle1Mask.forEach((v, r, c) => {
  if (v === 1) {
    masked[r][c] = arr[r][c];
  }
});

console.log(masked.map((e) => e.join("")).join("\n"));

// Display Results
console.log("Puzzle 1:", puzzle1);
console.log("Puzzle 2:", puzzle2);
