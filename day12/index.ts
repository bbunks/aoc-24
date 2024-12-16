import { Matrix } from "../libs/Matrix.ts";
import { enableLogging, log } from "../utils.ts";

const decoder = new TextDecoder();

type Tile = {
  x: number;
  y: number;
  tile: string;
  plotId: string;
};

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

const initialValues = input.split("\n").map((line) => line.split(""));

// Global variables
let puzzle1 = 0;
let puzzle2 = 0;

// Puzzle 1
const visitedTiles = new Set<string>();

function getTile(x: number, y: number): string {
  return initialValues[y][x];
}

function isVisited(x: number, y: number): boolean {
  return visitedTiles.has(`${x},${y}`);
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const plotInfoMap = new Map<
  string,
  { area: number; perimeter: number; sides: number }
>();

function inBounds(x: number, y: number): boolean {
  return (
    x >= 0 && y >= 0 && x < initialValues[0].length && y < initialValues.length
  );
}

function walk(x: number, y: number, tile: string, plotId: string): Tile[] {
  if (!inBounds(x, y)) return [];

  if (isVisited(x, y)) return [];
  if (getTile(x, y) !== tile) return [];

  visitedTiles.add(`${x},${y}`);
  const tiles: Tile[] = [];
  let perimeter = 4;

  for (const [dx, dy] of directions) {
    const newX = x + dx;
    const newY = y + dy;
    if (inBounds(newX, newY) && getTile(newX, newY) === tile) {
      --perimeter;
    }

    const newTiles = walk(newX, newY, tile, plotId);
    tiles.push(...newTiles);
  }

  plotInfoMap.get(plotId)!.area++;
  plotInfoMap.get(plotId)!.perimeter += perimeter;

  tiles.push({ x, y, tile, plotId });

  return tiles;
}

const plots: Tile[][] = [];
let plotIdIndex = 0;

for (let y = 0; y < initialValues.length; y++) {
  for (let x = 0; x < initialValues[y].length; x++) {
    if (isVisited(x, y)) continue;

    let plotId = getTile(x, y) + plotIdIndex++;
    plotInfoMap.set(plotId, {
      area: 0,
      perimeter: 0,
      sides: 0,
    });

    const tiles = walk(x, y, getTile(x, y), plotId);
    plots.push(tiles);
  }
}

enableLogging();

// Puzzle 2 Comp
plots.forEach((plot) => {
  let plotMatrix = Matrix.blank(initialValues.length, initialValues[0].length);

  for (const tile of plot) {
    plotMatrix.setValueAtCords(tile.x, tile.y, 1);
  }

  log("================");
  log("plot", plot[0].plotId);
  log("================");
  log(plotMatrix.toString());

  for (let i = 0; i < 4; ++i) {
    for (let y = -1; y < plotMatrix.height - 1; ++y) {
      let sideStarted = false;
      for (let x = 0; x < plotMatrix.width; ++x) {
        let upper = y < 0 ? 0 : plotMatrix.getValueFromCords(x, y);
        let below = plotMatrix.getValueFromCords(x, y + 1);
        if (upper === 0 && below === 1) {
          if (!sideStarted) {
            sideStarted = true;
            plotInfoMap.get(plot[0].plotId)!.sides++;
          }
        } else {
          sideStarted = false;
        }
      }
    }
    plotMatrix = plotMatrix.rotate90();
  }

  log("Area:", plotInfoMap.get(plot[0].plotId)!.area);
  log("Perimeter:", plotInfoMap.get(plot[0].plotId)!.perimeter);
  log("Sides:", plotInfoMap.get(plot[0].plotId)!.sides);
  log();
});

console.log(plots);
console.log(plotInfoMap);

// Puzzle 1 Calculation
plotInfoMap.forEach((value) => {
  puzzle1 += value.area * value.perimeter;
});
plotInfoMap.forEach((value) => {
  puzzle2 += value.area * value.sides;
});

// Print the answers
log("================");
log("Answers");
log("================");
log("Puzzle 1:", puzzle1);
log("Puzzle 2:", puzzle2);

console.log("Puzzle 1:", puzzle1);
console.log("Puzzle 2:", puzzle2);
