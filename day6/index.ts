const decoder = new TextDecoder();

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

let puzzle2 = 0;

// Break up the input
const arr = input.split("\n").map((e) => e.split(""));

let initialX = 0;
let initialY = 0;

// Order of the directions
const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

// Starting direction
let directionIndex = 0;

function rotateRight(directionIndex: number) {
  return (directionIndex + 1) % directions.length;
}

function rotateLeft(directionIndex: number) {
  return (directionIndex + directions.length - 1) % directions.length;
}

// Find the starting point
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

// Check if a point is in the grid
function inGrid(x: number, y: number) {
  return x >= 0 && y >= 0 && x < arr[0].length && y < arr.length;
}

// Step function - Move the guard forward one action
function step(state: { x: number; y: number; directionIndex: number }) {
  let { x, y, directionIndex } = state;

  // Get the velocity vector
  const currentDirection = directions[directionIndex];

  // Get the next position
  const nextX = state.x + currentDirection[0];
  const nextY = state.y + currentDirection[1];

  // Check if the next position is in the grid
  if (!inGrid(nextX, nextY)) {
    // Returning false means the guard has left the grid
    return false;
  }

  // Get the next tile
  const nextTile = arr[nextY][nextX];

  // Check if the next tile is an obstacle
  if (nextTile === "#") {
    directionIndex = rotateRight(directionIndex);
  } else {
    x = nextX;
    y = nextY;
  }
  return { x, y, directionIndex };
}

// Set of visited points
const visited = new Set<string>();

while (inGrid(x, y)) {
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

  // Check if the next tile is an obstacle we will skip on simualting as we know that there will be an exit
  if (
    arr[simY + directions[simDirectionIndex][1]][
      simX + directions[simDirectionIndex][0]
    ] === "#"
  )
    continue;

  // Check to see if the obstacle would be put somewhere we have already been; We will skip it as we the this would change the guard's path earlier
  const obstacleKey = `${simX + directions[simDirectionIndex][0]},${
    simY + directions[simDirectionIndex][1]
  }`;

  if (visited.has(obstacleKey)) continue;

  // For accuracy we will mark the obstacle on the grid and run the same step function on a clone of the guard.
  arr[simY + directions[simDirectionIndex][1]][
    simX + directions[simDirectionIndex][0]
  ] = "#";

  // used to track obstacles that the guard could hit
  const obstacleSet = new Set<string>();

  // Simulate the path

  while (inGrid(simX, simY)) {
    const newState = step({
      x: simX,
      y: simY,
      directionIndex: simDirectionIndex,
    });

    if (newState) {
      // if the location is marked in the set, we found a location that we have already been to
      const state = `${simX},${simY},${simDirectionIndex}`;
      if (obstacleSet.has(state)) {
        // this means we have found a loop so we can interate it and add the number of obstacles to the puzzle 2 answer
        puzzle2++;
        break;
      }

      // since the guard is moving clockwise, the next obstacle will be to the left so we track all the obstacles to the left
      const outsideDirection = directions[rotateLeft(simDirectionIndex)];
      const outterItem =
        arr[simY + outsideDirection[1]][simX + outsideDirection[0]];

      // if the obstacle is marked, we add it to the set
      if (outterItem === "#") {
        obstacleSet.add(state);
      }

      // Update the sim state
      simX = newState.x;
      simY = newState.y;

      simDirectionIndex = newState.directionIndex;
    } else {
      // If the guard has left the grid, we break out of the simulation
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
