const decoder = new TextDecoder();

let puzzle1 = 0;
let puzzle2 = 0;

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

const rules = input
  .split("\n\n")[0]
  .split("\n")
  .map((e) => e.split("|").map(Number));

const updateLists = input
  .split("\n\n")[1]
  .split("\n")
  .map((e) => e.split(",").map(Number));

const lookupMaps = updateLists.map((list) => {
  const map = new Map();
  for (let i = 0; i < list.length; i++) {
    map.set(list[i], i);
  }
  return map;
});

// Solution
for (let i = 0; i < updateLists.length; ++i) {
  const list = updateLists[i];
  let inOrder = true;
  const map = lookupMaps[i];

  const applicableRules = rules.filter(
    (rule) => map.has(rule[0]) && map.has(rule[1])
  );

  const ruleCount = applicableRules.length;
  for (let j = 0; j < ruleCount; ++j) {
    const rule = applicableRules[j];
    const leftIndex = map.get(rule[0]);
    const rightIndex = map.get(rule[1]);
    if (rightIndex <= leftIndex) {
      j = -1;

      list[leftIndex] = rule[1];
      list[rightIndex] = rule[0];
      map.set(rule[1], leftIndex);
      map.set(rule[0], rightIndex);
      inOrder = false;
    }
  }

  const middleValue = list[list.length >> 1];
  if (inOrder) {
    puzzle1 += middleValue;
  } else {
    puzzle2 += middleValue;
  }
}

console.log("Puzzle 1:", puzzle1);
console.log("Puzzle 2:", puzzle2);
