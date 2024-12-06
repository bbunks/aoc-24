import { Matrix } from "../libs/Matrix.ts";
import { enableLogging, log } from "../utils.ts";

const decoder = new TextDecoder();

let puzzle1 = 0;
let puzzle2 = 0;

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

// Break up the input
const arr = input.split("\n").map((e) => e.split(""));
const mask = new Matrix(arr.map((e) => e.map((e) => 0)));

let x = 0;
let y = 0;

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
let directionIndex = 0;

for (let i = 0; i < arr.length; ++i) {
  for (let j = 0; j < arr[i].length; ++j) {
    if (arr[i][j] === "^") {
      x = j;
      y = i;
      break;
    }
  }
}

let initialX = x;
let initialY = y;

const listOfObstcale: {
  x: number;
  y: number;
  direction: number;
}[] = [];

const obstacleSet = new Set<string>();

const sims: {
  startingX: number;
  startingY: number;
  startingDirection: number;
  success: boolean;
  steps: { x: number; y: number; directionIndex: number }[];
}[] = [];

function inGrid(x: number, y: number) {
  return x >= 0 && y >= 0 && x < arr[0].length && y < arr.length;
}

function step(
  state: { x: number; y: number; directionIndex: number },
  listOfObstcale: { x: number; y: number; direction: number }[]
) {
  let { x, y, directionIndex } = state;

  const currentDirection = directions[directionIndex];
  const nextX = state.x + currentDirection[0];
  const nextY = state.y + currentDirection[1];

  if (!inGrid(nextX, nextY)) {
    return false;
  }

  const nextTile = arr[nextY][nextX];
  if (nextTile === "#") {
    listOfObstcale.push({
      x: nextX,
      y: nextY,
      direction: directionIndex,
    });
    directionIndex = (state.directionIndex + 1) % directions.length;
  } else {
    x += currentDirection[0];
    y += currentDirection[1];
  }
  return { x, y, directionIndex };
}

// Puzzle 1
while (inGrid(x, y)) {
  mask.setValueAtCords(x, y, 1);

  const newState = step({ x, y, directionIndex }, listOfObstcale);
  if (newState) {
    if (
      arr[y + directions[directionIndex][1]][
        x + directions[directionIndex][0]
      ] !== "#"
    ) {
      // Simulate the path
      let simDirectionIndex = (directionIndex + 1) % directions.length;
      let simX = x + directions[directionIndex][0];
      let simY = y + directions[directionIndex][1];

      const obstacleKey = `${x + directions[simDirectionIndex][0]},${
        simY + directions[simDirectionIndex][1]
      }`;

      // const simSteps: { x: number; y: number; directionIndex: number }[] = [];
      let simTimesRotated = 0;
      // let success = false;
      arr[y + directions[directionIndex][1]][
        x + directions[directionIndex][0]
      ] = "#";

      let run = !obstacleSet.has(obstacleKey);

      while (inGrid(simX, simY) && run) {
        const newState = step(
          { x: simX, y: simY, directionIndex: simDirectionIndex },
          []
        );

        // simSteps.push({ x: simX, y: simY, directionIndex: simDirectionIndex });
        if (newState) {
          if (
            simX === x &&
            simY === y &&
            simDirectionIndex === directionIndex &&
            simX !== initialX &&
            simY !== initialY
          ) {
            obstacleSet.add(obstacleKey);
            // success = true;
            puzzle2++;
            // console.log(
            //   "Found a loop",
            //   x + directions[directionIndex][0],
            //   y + directions[directionIndex][1]
            // );
            break;
          }
          simX = newState.x;
          simY = newState.y;
          if (simDirectionIndex !== newState.directionIndex) {
            simTimesRotated++;
          }
          if (simTimesRotated > 500) {
            console.log("Too many rotations");

            break;
          }
          simDirectionIndex = newState.directionIndex;
        } else {
          break;
        }
      }
      // sims.push({
      //   startingX: x,
      //   startingY: y,
      //   startingDirection: directionIndex,
      //   success,
      //   steps: simSteps,
      // });

      // take the new state

      arr[y + directions[directionIndex][1]][
        x + directions[directionIndex][0]
      ] = ".";
    }
    x = newState.x;
    y = newState.y;
    directionIndex = newState.directionIndex;
  } else {
    break;
  }
}

mask.forEach((v, y, x) => {
  puzzle1 += v;
});

// listOfObstcale.forEach((e) => {
//   mask.setValueAtCords(e.x, e.y, 3);
// });

// // Debug
// // enableLogging();

// let directionsSymbols = ["^", ">", "v", "<"];

// sims.forEach((sim) => {
//   const s = mask.map((v) => v);
//   sim.steps.forEach((e) => {
//     s.setValueAtCords(e.x, e.y, 4);
//   });
//   s.setValueAtCords(sim.startingX, sim.startingY, 2);
//   log(
//     s
//       .toString()
//       .replaceAll("0", " ")
//       .replaceAll("1", ".")
//       .replaceAll("2", directionsSymbols[sim.startingDirection])
//       .replaceAll("3", "#")
//       .replaceAll("4", "O")
//       .replaceAll("5", "X")
//   );
//   if (sim.success) {
//     console.log(
//       s
//         .toString()
//         .replaceAll("0", " ")
//         .replaceAll("1", ".")
//         .replaceAll("2", directionsSymbols[sim.startingDirection])
//         .replaceAll("3", "#")
//         .replaceAll("4", "O")
//         .replaceAll("5", "X") + "\n"
//     );
//   }
// });

// mask.setValueAtCords(initialX, initialY, 2);
// log(
//   mask
//     .toString()
//     .replaceAll("0", " ")
//     .replaceAll("1", ".")
//     .replaceAll("2", directionsSymbols[directionIndex])
//     .replaceAll("3", "#")
//     .replaceAll("4", "O")
//     .replaceAll("5", "X")
// );

// console.log(arr.map((e) => e.join("")).join("\n"));

console.log("Puzzle 1:", puzzle1);
console.log("Puzzle 2:", puzzle2);
