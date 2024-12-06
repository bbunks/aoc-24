async function og() {
  async function readInput() {
    const file = await Deno.open("input.txt", {
      read: true,
    });

    const reader = file.readable;
    const stream = reader.pipeThrough(new TextDecoderStream());

    let input = "";
    for await (const chunk of stream) {
      input += chunk;
    }

    return input;
  }

  function checkLevel(level: number[]) {
    let direction = "";
    let safe = true;

    for (let i = 1; i < level.length; ++i) {
      let d = "";
      let c = level[i];

      let p = level[i - 1];
      let a = p - c;
      if (a > 0) {
        d = "d";
      }

      if (a < 0) {
        d = "u";
      }
      if (direction === "") {
        direction = d;
      }

      let dist = Math.abs(c - p);

      if (!(dist === 1 || dist === 2 || dist === 3)) {
        // console.log(index, i, c, p, dist, "dist");
        safe = false;
      }

      if (direction !== d) {
        // console.log(index, i, c, p, direction, d, "direction");
        safe = false;
      }
    }

    return safe;
  }

  const input = await readInput();
  let puzzle1 = 0;
  let puzzle2 = 0;

  const levels = input
    .split("\n")
    .map((e) => e.split(" ").map((e) => parseInt(e)));

  let p1 = levels.map(checkLevel);
  let p2 = levels.map((level) => {
    if (checkLevel(level)) return true;

    for (let i = 0; i < level.length; ++i) {
      const newTest = [...level];
      newTest.splice(i, 1);
      // console.log(i, level, newTest);
      if (checkLevel(newTest)) return true;
    }
  });

  p1.forEach((p) => {
    if (p) puzzle1++;
  });

  p2.forEach((p) => {
    if (p) puzzle2++;
  });

  // console.log("Puzzle 1:", puzzle1);
  // console.log("Puzzle 2:", puzzle2);
}

function opt() {
  function checkLevel(level: number[]) {
    let direction = "";

    // interate over values starting starting at the second index
    for (let i = 1; i < level.length; ++i) {
      const curr = level[i];
      const prev = level[i - 1];

      // Check if the Direction is has change
      const delta = prev - curr;
      const dir = delta > 0 ? "desc" : "asc";
      if (direction === "") direction = dir;
      if (direction !== dir) return false;

      // Check the distance between values in the level
      const dist = Math.abs(curr - prev);
      if (dist < 1 || dist > 3) return false;
    }

    return true;
  }

  let puzzle1 = 0;
  let puzzle2 = 0;

  // Read input from file
  const input = new TextDecoder().decode(Deno.readFileSync("input.txt"));

  // Parse inputs by spliting and maping each row into an array of numbers
  const levels = input
    .split("\n")
    .map((e) => e.split(" ").map((e) => parseInt(e)));

  // Check each level to see if it is safe
  for (let i = 0; i < levels.length; ++i) {
    const level = levels[i];
    if (checkLevel(level)) {
      // Add a success to both puzzles as this would pass in both cases
      ++puzzle1;
      ++puzzle2;
      continue;
    }

    // Check each instance if a single element was removed
    for (let i = 0; i < level.length; ++i) {
      const newTest = [...level];
      newTest.splice(i, 1);

      if (checkLevel(newTest)) {
        // Add a success to only puzzle 2 as this does not meet the requirements for puzzle 1
        ++puzzle2;
        break;
      }
    }
  }

  // Display Results
  // console.log("Puzzle 1:", puzzle1);
  // console.log("Puzzle 2:", puzzle2);
}

// I Feed my Alogoritm to Claude and it rewrote it to be 200 microseconds faster. It doubled the amount of code :/
function optAI() {
  function checkLevel(level: number[]) {
    // For arrays shorter than 2 elements, always valid
    if (level.length < 2) return true;

    const first = level[0];
    const second = level[1];
    const initialDelta = first - second;
    const isDesc = initialDelta > 0;

    // Pre-check first pair distance
    const firstDist = Math.abs(initialDelta);
    if (firstDist < 1 || firstDist > 3) return false;

    // Use a for loop instead of array methods for better performance
    for (let i = 2; i < level.length; i++) {
      const curr = level[i];
      const prev = level[i - 1];
      const delta = prev - curr;

      // Check direction matches initial direction
      if (delta > 0 !== isDesc) return false;

      // Check distance constraints
      const dist = Math.abs(delta);
      if (dist < 1 || dist > 3) return false;
    }

    return true;
  }

  let puzzle1 = 0;
  let puzzle2 = 0;

  // Read entire file at once
  const input = new TextDecoder().decode(Deno.readFileSync("input.txt"));
  const lines = input.split("\n");
  const len = lines.length;

  // Pre-allocate array size
  const levels = new Array(len);

  // Manual parsing is faster than multiple maps
  for (let i = 0; i < len; i++) {
    const line = lines[i];
    const nums = line.split(" ");
    const level = new Array(nums.length);
    for (let j = 0; j < nums.length; j++) {
      level[j] = parseInt(nums[j], 10);
    }
    levels[i] = level;
  }

  // Main processing loop
  for (let i = 0; i < len; i++) {
    const level = levels[i];

    if (checkLevel(level)) {
      puzzle1++;
      puzzle2++;
      continue;
    }

    const levelLen = level.length;
    // Only check puzzle2 if puzzle1 failed
    for (let j = 0; j < levelLen; j++) {
      // Create array without element at index j
      const newTest = new Array(levelLen - 1);
      for (let k = 0, m = 0; k < levelLen; k++) {
        if (k !== j) newTest[m++] = level[k];
      }

      if (checkLevel(newTest)) {
        puzzle2++;
        break;
      }
    }
  }
}

Deno.bench("og", og);
Deno.bench("opt", opt);
Deno.bench("optAI", optAI);

if (import.meta.main) {
  og();
  opt();
  optAI();
}
