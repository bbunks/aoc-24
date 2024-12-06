async function calc() {
  const file = await Deno.open("input.txt", {
    read: true,
  });

  const reader = file.readable;

  const stream = reader.pipeThrough(new TextDecoderStream());

  const lists: number[][] = [[], []];
  let listIndex = 0;
  let currentNumber = "";
  let currentChar = "";

  const occuranceMap = new Map<number, number>();

  function pushCurrentNumber() {
    const p = parseInt(currentNumber);

    if (listIndex) occuranceMap.set(p, (occuranceMap.get(p) ?? 0) + 1);
    lists[listIndex].push(p);

    listIndex = listIndex ? 0 : 1;
    currentNumber = "";
  }

  for await (const chunk of stream) {
    for (let i = 0; i < chunk.length; ++i) {
      currentChar = chunk[i];

      if (
        (currentChar === " " || currentChar === "\n") &&
        currentNumber.length > 0
      ) {
        pushCurrentNumber();
      } else if (currentChar !== " " && currentChar !== "\n") {
        currentNumber += currentChar;
      }
    }
  }

  if (currentNumber.length > 0) {
    pushCurrentNumber();
  }

  const sortedLists = lists.map((list) => list.toSorted());

  let sum = 0;
  let score = 0;

  for (let i = 0; i < sortedLists[0].length; ++i) {
    sum += Math.abs(sortedLists[0][i] - sortedLists[1][i]);
    score += sortedLists[0][i] * (occuranceMap.get(sortedLists[0][i]) ?? 0);
  }

  return [sum, score];
}

Deno.bench("a", async function () {
  await calc();
});

if (import.meta.main) {
  const results = await calc();
  console.log("Sum of Distances:", results[0]);
  console.log("Similarity Score:", results[1]);
}
