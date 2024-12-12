const decoder = new TextDecoder();

const input = decoder.decode(Deno.readFileSync("input.txt"));

function og() {}

function opt() {}

function optAI() {}

Deno.bench("og", og);
Deno.bench("opt", opt);
Deno.bench("optAI", optAI);
