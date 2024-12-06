import { log } from "../utils.ts";
import { Matrix } from "../libs/Matrix.ts";

const decoder = new TextDecoder();

const input = decoder.decode(Deno.readFileSync("input.txt"));

function og() {
  let puzzle1 = 0;
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

  const obstacleSet = new Set<string>();

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
      directionIndex = (state.directionIndex + 1) % directions.length;
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
    if (newState) {
      if (
        arr[y + directions[directionIndex][1]][
          x + directions[directionIndex][0]
        ] !== "#"
      ) {
        // Simulate the path
        let simDirectionIndex = directionIndex;
        let simX = x;
        let simY = y;

        const obstacleKey = `${x + directions[simDirectionIndex][0]},${
          simY + directions[simDirectionIndex][1]
        }`;

        let simTimesRotated = 0;

        // Mark the path as obstacle

        let run = !obstacleSet.has(obstacleKey) && !visited.has(obstacleKey);

        if (run)
          arr[y + directions[directionIndex][1]][
            x + directions[directionIndex][0]
          ] = "#";

        let visitedState = new Set<string>();
        while (inGrid(simX, simY) && run) {
          const newState = step({
            x: simX,
            y: simY,
            directionIndex: simDirectionIndex,
          });

          if (newState) {
            if (
              simX === x &&
              simY === y &&
              simDirectionIndex === directionIndex &&
              (simX !== initialX || simY !== initialY) &&
              simTimesRotated > 3
            ) {
              obstacleSet.add(obstacleKey);
              puzzle2++;

              break;
            }

            const state = `${simX},${simY},${simDirectionIndex}`;
            if (visitedState.has(state)) {
              // console.log("Sent into a loop but not from this obstacle", state);
              puzzle2++;
              break;
            }

            visitedState.add(state);

            simX = newState.x;
            simY = newState.y;

            if (simDirectionIndex !== newState.directionIndex) {
              simTimesRotated++;
            }

            simDirectionIndex = newState.directionIndex;
          } else {
            break;
          }
        }

        // Remove the obstacle
        if (run)
          arr[y + directions[directionIndex][1]][
            x + directions[directionIndex][0]
          ] = ".";
      }

      // Update the state for the next iteration
      visited.add(`${x},${y}`);
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
}

function onlineSolution() {
  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  const grid = input.split("\n").map((e) => e.split(""));
  let startpos = [-1, -1];
  let startdir = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == "^") {
        startpos = [i, j];
        grid[i][j] = ".";
        break;
      }
    }
    if (startpos[0] !== -1) break;
  }
  let pos = [...startpos];
  let dir = startdir;

  const visited = new Set();
  visited.add(`${pos[0]},${pos[1]}`);
  const turnRight = (d: number) => {
    return (d + 1) % 4;
  };
  const ingrid = (row: number, col: number) =>
    row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

  while (true) {
    let nextpos = [pos[0] + dirs[dir][0], pos[1] + dirs[dir][1]];
    if (!ingrid(nextpos[0], nextpos[1])) {
      break;
    }
    if (grid[nextpos[0]][nextpos[1]] === "#") {
      dir++;
      dir %= 4;
    } else {
      pos = [nextpos[0], nextpos[1]];
      visited.add(`${pos[0]},${pos[1]}`);
    }
  }

  let loops = (obs: [number, number]) => {
    grid[obs[0]][obs[1]] = "#";
    let pos = [...startpos];
    let dir = startdir;
    let visited = new Set();
    while (true) {
      let state = `${pos[0]},${pos[1]},${dirs[dir][0]},${dirs[dir][1]}`;
      if (visited.has(state)) {
        grid[obs[0]][obs[1]] = ".";
        return true;
      }
      visited.add(state);
      let nextpos = [pos[0] + dirs[dir][0], pos[1] + dirs[dir][1]];
      if (!ingrid(nextpos[0], nextpos[1])) {
        grid[obs[0]][obs[1]] = ".";
        return false;
      }
      if (grid[nextpos[0]][nextpos[1]] == "#") {
        dir++;
        dir %= 4;
      } else {
        pos = [nextpos[0], nextpos[1]];
      }
    }
  };
  let loopPositions = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (!visited.has(`${i},${j}`)) continue;
      if (grid[i][j] == "#") continue;
      if (i == startpos[0] && j == startpos[1]) continue;
      if (loops([i, j])) {
        loopPositions++;
      }
    }
  }
}

function opt() {
  let puzzle1 = 0;
  let puzzle2 = 0;

  // Read File
  const input = decoder.decode(Deno.readFileSync("input.txt"));

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
}

function optAI() {}

Deno.bench("og", og);
// Deno.bench("online", onlineSolution);
Deno.bench("opt", opt);
Deno.bench("optAI", optAI);
