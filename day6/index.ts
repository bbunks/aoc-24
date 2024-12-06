import { Matrix } from "../libs/Matrix.ts";

const decoder = new TextDecoder();

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

let puzzle2 = 0;

// Break up the input
const arr = input.split("\n").map((e) => e.split(""));
const mask = new Matrix(arr.map((e) => e.map((e) => 0)));

let initialX = 0;
let initialY = 0;

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
let directionIndex = 0;

function rotateRight(directionIndex: number) {
  return (directionIndex + 1) % directions.length;
}

function rotateLeft(directionIndex: number) {
  return (directionIndex + directions.length - 1) % directions.length;
}

let found = false;
for (let i = 0; i < arr.length; ++i) {
  for (let j = 0; j < arr[i].length; ++j) {
    if (arr[i][j] === "^") {
      initialX = j;
      initialY = i;
      found = true;
      break;
    }
  }
  if (found) break;
}

let x = initialX;
let y = initialY;

function inGrid(x: number, y: number) {
  return x >= 0 && y >= 0 && x < arr[0].length && y < arr.length;
}

function step(state: { x: number; y: number; directionIndex: number }) {
  let { x, y, directionIndex } = state;

  const currentDirection = directions[directionIndex];
  const nextX = state.x + currentDirection[0];
  const nextY = state.y + currentDirection[1];

  if (!inGrid(nextX, nextY)) {
    return false;
  }

  const nextTile = arr[nextY][nextX];
  if (nextTile === "#") {
    directionIndex = rotateRight(directionIndex);
  } else {
    x = nextX;
    y = nextY;
  }
  return { x, y, directionIndex };
}

const visited = new Set<string>();

// Puzzle 1
while (inGrid(x, y)) {
  mask.setValueAtCords(x, y, 1);

  const newState = step({ x, y, directionIndex });
  visited.add(`${x},${y}`);

  if (!newState) {
    break;
  }
  // Setup sim variables
  let simDirectionIndex = directionIndex;
  let simX = x;
  let simY = y;

  // save the current state
  const startX = simX;
  const startY = simY;
  const startDirectionIndex = simDirectionIndex;

  // Update the state for the next iteration
  x = newState.x;
  y = newState.y;
  directionIndex = newState.directionIndex;

  if (
    arr[simY + directions[simDirectionIndex][1]][
      simX + directions[simDirectionIndex][0]
    ] === "#"
  )
    continue;

  const obstacleKey = `${simX + directions[simDirectionIndex][0]},${
    simY + directions[simDirectionIndex][1]
  }`;

  if (visited.has(obstacleKey)) continue;

  // Mark the path as obstacle
  arr[simY + directions[simDirectionIndex][1]][
    simX + directions[simDirectionIndex][0]
  ] = "#";

  // Simulate the path
  const obstacleSet = new Set<string>();

  while (inGrid(simX, simY)) {
    const newState = step({
      x: simX,
      y: simY,
      directionIndex: simDirectionIndex,
    });

    if (newState) {
      const state = `${simX},${simY},${simDirectionIndex}`;
      if (obstacleSet.has(state)) {
        puzzle2++;
        break;
      }

      const outsideDirection = directions[rotateLeft(simDirectionIndex)];
      const outterItem =
        arr[simY + outsideDirection[1]][simX + outsideDirection[0]];

      if (outterItem === "#") {
        obstacleSet.add(state);
      }

      simX = newState.x;
      simY = newState.y;

      simDirectionIndex = newState.directionIndex;
    } else {
      break;
    }
  }

  // Remove the obstacle
  arr[startY + directions[startDirectionIndex][1]][
    startX + directions[startDirectionIndex][0]
  ] = ".";
}

console.log("Puzzle 1:", visited.size);
console.log("Puzzle 2:", puzzle2);
