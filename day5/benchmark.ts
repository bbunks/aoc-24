import { log } from "../utils.ts";

const decoder = new TextDecoder();

const input = decoder.decode(Deno.readFileSync("input.txt"));

function og() {
  let puzzle1 = 0;
  let puzzle2 = 0;

  // Read File

  const rules = input
    .split("\n\n")[0]
    .split("\n")
    .map((e) => e.split("|").map(Number));

  const updateLists = input
    .split("\n\n")[1]
    .split("\n")
    .map((e) => e.split(",").map(Number));

  const p2updateLists = updateLists.map((e) => [...e]);

  // Solution
  for (let i = 0; i < updateLists.length; i++) {
    const e = updateLists[i];
    // console.log("================");
    let inOrder = true;

    for (let j = 0; j < rules.length; j++) {
      const rule = rules[j];
      let page = e.indexOf(rule[0]);
      let index = e.indexOf(rule[1]);
      if (page >= 0 && index >= 0 && index <= page) {
        inOrder = false;
      }
      // console.log(e, rule, page, index, inOrder);
    }

    if (inOrder) {
      let middleValue = e[Math.floor(e.length / 2)];
      puzzle1 += middleValue;
    }
  }

  for (let i = 0; i < p2updateLists.length; i++) {
    const e = p2updateLists[i];
    // console.log("================");
    let inOrder = true;

    for (let j = 0; j < rules.length; j++) {
      const rule = rules[j];
      let page = e.indexOf(rule[0]);
      let index = e.indexOf(rule[1]);
      // console.log(e, rule, page, index, inOrder);
      if (page >= 0 && index >= 0 && index <= page) {
        // console.log("swap and restart");
        j = -1;
        let temp = e[page];
        e[page] = e[index];
        e[index] = temp;
      }
    }

    if (inOrder) {
      let middleValue = e[Math.floor(e.length / 2)];
      puzzle2 += middleValue;
    }
  }

  puzzle2 -= puzzle1;

  // Display Results
  // console.log("Puzzle 1:", puzzle1);
  // console.log("Puzzle 2:", puzzle2);
}

function opt() {
  let puzzle1 = 0;
  let puzzle2 = 0;

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
}

const workers: Worker[] = [];
const workerCount = 10;

for (let i = 0; i < workerCount; ++i) {
  // console.log("Creating worker", index);
  const worker = new Worker(new URL("./worker.ts", import.meta.url).href, {
    type: "module",
  });

  workers.push(worker);
}

function optMultithread(b: Deno.BenchContext) {
  b.start();

  let puzzle1 = 0;
  let puzzle2 = 0;

  const rules = input
    .split("\n\n")[0]
    .split("\n")
    .map((e) => e.split("|").map(Number));

  const updateLists = input
    .split("\n\n")[1]
    .split("\n")
    .map((e) => e.split(",").map(Number));

  let workerIndex = 0;
  const promises: Promise<[number, number]>[] = [];
  const resolvers: ((
    value: [number, number] | PromiseLike<[number, number]>
  ) => void)[] = [];

  for (let i = 0; i < workerCount; ++i) {
    workers[i].onmessage = (e: MessageEvent<[number, number, number]>) => {
      // Note the type change here
      // console.log("Received from worker", index);
      const [p1, p2, resolveId] = e.data; // Destructure all three values
      resolvers[resolveId]([p1, p2]); // Use the resolveId to find the correct promise
    };
  }

  for (let i = 0; i < updateLists.length; ++i) {
    const resolveId = resolvers.length;
    // console.log("Sending message to worker", workerIndex);
    const promise = new Promise<[number, number]>((resolve) => {
      resolvers.push(resolve);
    });
    promise.then(([p1, p2]) => {
      puzzle1 += p1;
      puzzle2 += p2;
    });
    promises.push(promise);
    workers[workerIndex].postMessage({
      updateList: updateLists[i],
      rules,
      resolveId: resolveId,
    });
    workerIndex = (workerIndex + 1) % workers.length;
  }

  Promise.all(promises).then(b.end);
  // Display Results
  // console.log("Puzzle 1:", puzzle1);
  // console.log("Puzzle 2:", puzzle2);

  // Clean Up Workers
}

function optAI(b: Deno.BenchContext) {
  let puzzle1 = 0;
  let puzzle2 = 0;

  // Pre-process rules and create lookup arrays for faster access
  const [rulesText, updateListsText] = input.split("\n\n");

  const rules = rulesText.split("\n").map((e) => e.split("|").map(Number));

  const updateLists = updateListsText
    .split("\n")
    .map((e) => e.split(",").map(Number));

  // Create lookup objects for each list to avoid repeated indexOf calls
  const lookupMaps = updateLists.map((list) => {
    const lookup: { [key: number]: number } = {};
    for (let i = 0; i < list.length; i++) {
      lookup[list[i]] = i;
    }
    return lookup;
  });

  // Solution
  for (let i = 0; i < updateLists.length; ++i) {
    const e = updateLists[i];
    const lookup = lookupMaps[i];
    let inOrder = true;

    for (let j = 0; j < rules.length; ++j) {
      const rule = rules[j];
      const a = rule[0];
      const b = rule[1];

      if (a in lookup && b in lookup) {
        const page = lookup[a];
        const index = lookup[b];

        if (index <= page) {
          // Swap elements
          e[page] = b;
          e[index] = a;

          // Update lookup
          lookup[b] = page;
          lookup[a] = index;

          // Mark as not in order
          inOrder = false;

          // Restart rules loop
          j = -1;
        }
      }
    }

    const middleValue = e[e.length >> 1];
    inOrder ? (puzzle1 += middleValue) : (puzzle2 += middleValue);
  }

  // console.log("Puzzle 1:", puzzle1);
  // console.log("Puzzle 2:", puzzle2);
}

Deno.bench("og", og);
await new Promise((resolve) => setTimeout(resolve, 1000));
Deno.bench("opt", opt);
await new Promise((resolve) => setTimeout(resolve, 1000));
Deno.bench("optMT", optMultithread);
await new Promise((resolve) => setTimeout(resolve, 1000));
Deno.bench("optAI", optAI);

workers.forEach((worker) => {
  worker.terminate();
});
