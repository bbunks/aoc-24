import { Matrix } from "../libs/Matrix.ts";
import { enableLogging, isLogging, log } from "../utils.ts";

const decoder = new TextDecoder();

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

// Global variables
let puzzle1 = 0;
let puzzle2 = 0;

const grid = input.split("\n").map((line) => line.split("").map(Number));

const directions = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function testDirectionsForNextNumber(
  x: number,
  y: number,
  currentValue: number,
  currentPath: { x: number; y: number }[]
): { score: number; path: { x: number; y: number }[][] } {
  if (grid[y][x] === currentValue) {
    if (currentValue === 9) {
      return { score: 1, path: [currentPath] };
    }

    let currScore = 0;
    let paths: { x: number; y: number }[][] = [];

    directions.forEach((direction) => {
      const newX = x + direction.x;
      const newY = y + direction.y;
      if (
        newX >= 0 &&
        newX < grid[0].length &&
        newY >= 0 &&
        newY < grid.length
      ) {
        const { score, path } = testDirectionsForNextNumber(
          newX,
          newY,
          currentValue + 1,
          [...currentPath, { x: newX, y: newY }]
        );
        paths.push(...path);
        currScore += score;
      }
    });

    return { score: currScore, path: paths };
  }

  return { score: 0, path: [] };
}

const trails: {
  x: number;
  y: number;
  path: {
    x: number;
    y: number;
  }[][];
}[] = [];

// Read
for (let y = 0; y < grid.length; ++y) {
  for (let x = 0; x < grid[0].length; ++x) {
    let { score, path } = testDirectionsForNextNumber(x, y, 0, []);

    if (grid[y][x] === 0) trails.push({ x, y, path });

    puzzle2 += score;
  }
}

// enableLogging();
if (isLogging()) {
  const data = new Matrix(grid);

  trails.forEach((trail) => {
    log("===================");
    log(trail.x, trail.y);
    log("===================");

    trail.path.forEach((path) => {
      const mask = Matrix.blank(grid[0].length, grid.length);

      path.forEach((pos) => {
        mask.setValueAtCords(pos.x, pos.y, 1);
      });

      const out = data.map((v, x, y) => {
        return v * mask.getValueFromCords(x, y);
      });

      log(out.toString().replaceAll("0", "."));
      log();
    });
  });
}

trails.forEach((trail) => {
  const uniqueEnds = new Set();
  trail.path.forEach((path) => {
    const last = path[path.length - 1];
    uniqueEnds.add(last.x + "|" + last.y);
  });
  puzzle1 += uniqueEnds.size;
});

// Print the answers
console.log("Puzzle 1:", puzzle1);
console.log("Puzzle 2:", puzzle2);
