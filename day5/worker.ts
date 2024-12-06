function evalute(updateList: number[], rules: number[][]) {
  let inOrder = true;

  let applicableRules = rules.filter((rule) => {
    return updateList.includes(rule[0]) && updateList.includes(rule[1]);
  });

  const ruleCount = applicableRules.length;
  for (let j = 0; j < ruleCount; ++j) {
    const rule = applicableRules[j];
    let page = updateList.indexOf(rule[0]);
    let index = updateList.indexOf(rule[1]);
    if (index <= page) {
      j = -1;
      let temp = updateList[page];
      updateList[page] = updateList[index];
      updateList[index] = temp;
      inOrder = false;
    }
  }

  let middleValue = updateList[Math.floor(updateList.length / 2)];
  if (inOrder) {
    return [middleValue, 0];
  } else {
    return [0, middleValue];
  }
}

self.addEventListener("message", (e) => {
  // Process lists
  // @ts-ignore
  const result = evalute(e.data.updateList, e.data.rules);
  // console.log("Worker finished", result);

  // Send results back to main thread
  // @ts-ignore
  self.postMessage([result[0], result[1], e.data.resolveId]);
});
