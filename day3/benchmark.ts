function og() {
  const decoder = new TextDecoder();

  function isNumeric(str: string) {
    return (
      str.length === 1 && str.charCodeAt(0) >= 48 && str.charCodeAt(0) <= 57
    ); // ASCII codes for '0' to '9'
  }

  let puzzle1 = 0;
  let puzzle2 = 0;

  // Read File
  const input = decoder.decode(Deno.readFileSync("input.txt"));

  let state = 0;
  let num1 = "";
  let num2 = "";

  let enabled = true;

  const length = input.length;
  for (let i = 0; i < length; ++i) {
    let char = input[i];
    if (!enabled && input.startsWith("do()", i)) {
      enabled = true;
      i += 3;

      continue;
    }

    if (enabled && input.startsWith("don't()", i)) {
      enabled = false;
      i += 6;

      continue;
    }

    switch (state) {
      case 0:
        if (char === "m") {
          state++;
        } else {
          state = 0;
        }
        break;
      case 1:
        if (char === "u") {
          state++;
        } else {
          state = 0;
        }
        break;
      case 2:
        if (char === "l") {
          state++;
        } else {
          state = 0;
        }
        break;
      case 3:
        if (char === "(") {
          state++;
        } else {
          state = 0;
        }
        break;
      case 4:
        if (isNumeric(char)) {
          num1 += char;
        } else if (char === "," && num1.length > 0) {
          state++;
        } else {
          state = 0;
          // clear these here to reduce the number of times we set them to empty strings
          num1 = "";
          num2 = "";
        }
        break;
      case 5:
        if (isNumeric(char)) {
          num2 += char;
        } else if (char === ")" && num2.length > 0) {
          puzzle1 += parseInt(num1) * parseInt(num2);
          if (enabled) puzzle2 += parseInt(num1) * parseInt(num2);
          state = 0;
          // clear these here to reduce the number of times we set them to empty strings
          num1 = "";
          num2 = "";
        } else {
          state = 0;
          // clear these here to reduce the number of times we set them to empty strings
          num1 = "";
          num2 = "";
        }
        break;
    }
  }

  // Display Results
  console.log("Puzzle 1:", puzzle1);
  console.log("Puzzle 2:", puzzle2);
}

function opt() {
  const decoder = new TextDecoder();

  let puzzle1 = 0;
  let puzzle2 = 0;

  // Read File
  const input = decoder.decode(Deno.readFileSync("input.txt"));

  let enabled = true;

  for (let i = 0; i < input.length; ++i) {
    if (input.substring(i, i + 4) == "do()") {
      enabled = true;
      i += 3;

      continue;
    }
    if (input.substring(i, i + 7) == "don't()") {
      enabled = false;
      i += 6;

      continue;
    }
    const reg = /^mul\(\d\d?\d?,\d\d?\d?\)/;
    const testString = input.substring(i);
    if (reg.test(testString)) {
      const comaIndex = testString.indexOf(",");
      const parIndex = testString.indexOf(")");

      let num1 = parseInt(testString.substring(4, comaIndex));
      let num2 = parseInt(testString.substring(comaIndex + 1, parIndex));

      puzzle1 += num1 * num2;
      if (enabled) puzzle2 += num1 * num2;

      i += parIndex;
    }
  }

  // Display Results
  // console.log("Puzzle 1:", puzzle1);
  // console.log("Puzzle 2:", puzzle2);
}

// I Feed my Alogoritm to Claude and it rewrote it to be 10 microseconds faster. It doubled the amount of code, so I am not a fan.
function optAI() {
  const decoder = new TextDecoder();

  let puzzle1 = 0;
  let puzzle2 = 0;

  // Read File
  const input = decoder.decode(Deno.readFileSync("input.txt"));

  let enabled = true;

  const length = input.length;
  for (let i = 0; i < length; ++i) {
    if (input.startsWith("do()", i)) {
      enabled = true;
      i += 3;

      continue;
    }

    if (input.startsWith("don't()", i)) {
      enabled = false;
      i += 6;

      continue;
    }

    const reg = /^mul\((\d{1,3}),(\d{1,3})\)/;
    const testString = input.substring(i);
    const match = reg.exec(testString);
    if (match) {
      const [_, num1, num2] = match.map(Number); // Destructure and convert to numbers

      puzzle1 += num1 * num2;
      if (enabled) puzzle2 += num1 * num2;

      i += match[0].length;
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
