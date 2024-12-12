const decoder = new TextDecoder();

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

// Global variables
let puzzle1 = 0;
let puzzle2 = 0;

// Puzzle 1
const sizes = input.split("").map(Number);
const sizeSum = sizes.reduce((a, b) => a + b, 0);

const data: (number | null)[] = [];

const writtenData: { start: number; length: number; id: number }[] = [];
const emptyData: { start: number; length: number }[] = [];

sizes.forEach((size, id) => {
  for (let i = 0; i < size; i++) {
    if (id % 2 === 0) {
      data.push(Math.ceil(id / 2));
      if (i === 0) {
        writtenData.push({
          start: data.length - 1,
          length: size,
          id: Math.ceil(id / 2),
        });
      }
    } else {
      // P
      if (i === 0) {
        emptyData.push({
          start: data.length,
          length: size,
        });
      }
      data.push(null);
    }
  }
});

const compressedData = data.slice();

for (let i = compressedData.length - 1; i >= 0; --i) {
  const current = data[i];
  if (current === null) {
    continue;
  }

  const firstNullIndex = compressedData.findIndex((e) => e === null);
  if (firstNullIndex >= i) {
    break;
  }

  compressedData[firstNullIndex] = current;
  compressedData[i] = null;
}

let checksum = 0;

for (let i = 0; i < compressedData.length; ++i) {
  checksum += (compressedData[i] ?? 0) * i;
}

const compressedChunkData = data.slice();

writtenData
  .map((e) => ({ ...e }))
  .toReversed()
  .forEach((lastFullData) => {
    // Find the first empty data with a length that is greater than the last full data length
    const firstEmptyData = emptyData.find(
      (e) => e.length >= lastFullData.length && e.start < lastFullData.start
    );

    if (!firstEmptyData) {
      return;
    }

    for (
      let i = lastFullData.start;
      i < lastFullData.start + lastFullData.length;
      ++i
    ) {
      compressedChunkData[i] = null;
    }

    for (
      let i = firstEmptyData.start;
      i < firstEmptyData.start + lastFullData.length;
      ++i
    ) {
      compressedChunkData[i] = lastFullData.id;
    }

    firstEmptyData.start += lastFullData.length;
    firstEmptyData.length = firstEmptyData.length - lastFullData.length;
  });

for (let i = 0; i < compressedChunkData.length; ++i) {
  puzzle2 += (compressedChunkData[i] ?? 0) * i;
}
// Print the answers
console.log("Puzzle 1:", checksum);
console.log("Puzzle 2:", puzzle2);
