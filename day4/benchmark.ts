function og() {}

function opt() {}

function optAI() {}

Deno.bench("og", og);
Deno.bench("opt", opt);
Deno.bench("optAI", optAI);

if (import.meta.main) {
  og();
  opt();
  optAI();
}
