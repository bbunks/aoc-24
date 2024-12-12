import { Matrix } from "../libs/Matrix.ts";
import { enableLogging, isLogging, log } from "../utils.ts";

const decoder = new TextDecoder();

// Read File
const input = decoder.decode(Deno.readFileSync("input.txt"));

// Global variables
let puzzle1 = 0;
let puzzle2 = 0;

// Print the answers
console.log("Puzzle 1:", puzzle1);
console.log("Puzzle 2:", puzzle2);
