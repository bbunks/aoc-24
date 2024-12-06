const decoder = new TextDecoder();

let puzzle1 = 0;
let puzzle2 = 0;

const order = "XMAS".split("");

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

const arr = input.split("\n").map((e) => e.split(""));
const width = arr[0].length - 1;
const height = arr.length - 1;
const flat = arr.flat();
const flatString = flat.join("");

console.log(input);

//return true if left
let regex = new RegExp(`XMAS`, "g");
console.log(flatString.match(regex));
puzzle1 += flatString.match(regex)?.length ?? 0;

//return true if right
regex = new RegExp(`SAMX`, "g");
console.log(flatString.match(regex));
puzzle1 += flatString.match(regex)?.length ?? 0;

//return true if down
regex = new RegExp(`X.{${width}}M.{${width}}A.{${width}}S`, "g");
console.log(flatString.match(regex));
puzzle1 += flatString.match(regex)?.length ?? 0;

//return true if up
regex = new RegExp(`S.{${width}}A.{${width}}M.{${width}}X`, "g");
console.log(flatString.match(regex));
puzzle1 += flatString.match(regex)?.length ?? 0;

//return true if down right
regex = new RegExp(`X.{${width + 1}}M.{${width + 1}}A.{${width + 1}}S`, "g");
console.log(flatString.match(regex));
puzzle1 += flatString.match(regex)?.length ?? 0;

//return true if up left
regex = new RegExp(`S.{${width + 1}}A.{${width + 1}}M.{${width + 1}}X`, "g");
console.log(flatString.match(regex));
puzzle1 += flatString.match(regex)?.length ?? 0;

//return true if down left
regex = new RegExp(`X.{${width - 1}}M.{${width - 1}}A.{${width - 1}}S`, "g");
console.log(flatString.match(regex));
puzzle1 += flatString.match(regex)?.length ?? 0;

//return true if up right
regex = new RegExp(`S.{${width - 1}}A.{${width - 1}}M.{${width - 1}}X`, "g");
console.log(flatString.match(regex));
puzzle1 += flatString.match(regex)?.length ?? 0;

// Display Results
console.log("Puzzle 1:", puzzle1);
console.log("Puzzle 2:", puzzle2);
