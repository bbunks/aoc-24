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

// Pre-allocate workers array
const workers = new Array(10);
let workerIndex = 0;
const promises: Promise<[number, number]>[] = [];
const resolvers: ((
  value: [number, number] | PromiseLike<[number, number]>
) => void)[] = [];

// Create workers in parallel
for (let i = 0; i < 10; ++i) {
  const worker = new Worker(new URL("./worker.ts", import.meta.url).href, {
    type: "module",
  });

  worker.onmessage = (e: MessageEvent<[number, number, number]>) => {
    const [p1, p2, resolveId] = e.data;
    resolvers[resolveId]([p1, p2]);
  };

  workers[i] = worker;
}

// Pre-allocate promises array
promises.length = updateLists.length;

// Process lists in chunks for better memory usage
const chunkSize = 1000;
for (let i = 0; i < updateLists.length; i += chunkSize) {
  const end = Math.min(i + chunkSize, updateLists.length);

  // Process chunk
  for (let j = i; j < end; j++) {
    const resolveId = resolvers.length;
    const promise = new Promise<[number, number]>((resolve) => {
      resolvers.push(resolve);
    });
    promise.then(([p1, p2]) => {
      puzzle1 += p1;
      puzzle2 += p2;
    });
    promises[j] = promise;

    workers[workerIndex].postMessage({
      updateList: updateLists[j],
      rules,
      resolveId,
    });
    workerIndex = (workerIndex + 1) % workers.length;
  }
}

// Wait for all promises and cleanup
Promise.all(promises).then(() => {
  console.log("Puzzle 1:", puzzle1);
  console.log("Puzzle 2:", puzzle2);

  workers.forEach((worker) => worker.terminate());
});
