const decoder = new TextDecoder();

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

const grid = input.split("\n").map((e) => e.split(""));

const antennaMap = new Map<string, { x: number; y: number }[]>();
const antennas: { x: number; y: number }[] = [];

// Global variables
let puzzle1 = 0;
let puzzle2 = 0;

// Puzzle 1
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const cell = grid[y][x];
    if (cell !== ".") {
      if (!antennaMap.has(cell)) {
        antennaMap.set(cell, []);
      }
      // @ts-ignore checked above
      antennaMap.get(cell).push({ x, y });
      antennas.push({ x, y });
    }
  }
}

const antinodeMap = new Map<string, { x: number; y: number }[]>();
const antinotes: { x: number; y: number }[] = [];

antennaMap.forEach((signal, key) => {
  signal.forEach((pair) => {
    const { x, y } = pair;
    let otherSignals = signal.filter((e) => e !== pair);

    otherSignals.forEach((otherSignal) => {
      const { x: x2, y: y2 } = otherSignal;

      let xDistance = x - x2;
      let yDistance = y - y2;

      let antinode = { x: x + xDistance, y: y + yDistance };

      if (!antinodeMap.has(key)) {
        antinodeMap.set(key, []);
      }

      if (
        antinode.x >= 0 &&
        antinode.x < grid[0].length &&
        antinode.y >= 0 &&
        antinode.y < grid.length &&
        !antinotes.some((e) => e.x === antinode.x && e.y === antinode.y)
      ) {
        puzzle1 += 1;
        antinotes.push(antinode);
        // @ts-ignore checked above
        antinodeMap.get(key).push(antinode);
      }
    });
  });
});

// Puzzle 2
const antinodeMap2 = new Map<string, { x: number; y: number }[]>();
const antinodes2: { x: number; y: number }[] = [];

antennaMap.forEach((signal, key) => {
  signal.forEach((pair) => {
    const { x, y } = pair;
    let otherSignals = signal.filter((e) => e !== pair);

    otherSignals.forEach((otherSignal) => {
      const { x: x2, y: y2 } = otherSignal;

      let xDistance = x - x2;
      let yDistance = y - y2;

      let antinode = { x: x2, y: y2 };
      antinode.x += xDistance;
      antinode.y += yDistance;

      while (
        antinode.x >= 0 &&
        antinode.x < grid[0].length &&
        antinode.y >= 0 &&
        antinode.y < grid.length
      ) {
        if (!antinodeMap2.has(key)) {
          antinodeMap2.set(key, []);
        }

        if (
          // @ts-ignore checked above
          antinodes2.some((e) => e.x === antinode.x && e.y === antinode.y)
        ) {
          antinode.x += xDistance;
          antinode.y += yDistance;
          continue;
        }

        puzzle2 += 1;
        antinodes2.push({ ...antinode });
        // @ts-ignore checked above
        antinodeMap2.get(key).push({ ...antinode });
        antinode.x += xDistance;
        antinode.y += yDistance;
      }
    });
  });
});

// Debug

grid
  .map((row, i) =>
    row
      .map((cell, j) => {
        if (antinodes2.some((e) => e.x === j && e.y === i) && cell === ".") {
          return "#";
        }
        return cell;
      })
      .join("")
  )
  .forEach((row) => console.log(row));

// Print the answers
console.log("Puzzle 1:", puzzle1);
console.log("Puzzle 2:", puzzle2);
