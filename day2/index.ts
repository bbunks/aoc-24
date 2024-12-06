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

if (import.meta.main) {
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
  console.log("Puzzle 1:", puzzle1);
  console.log("Puzzle 2:", puzzle2);
}
