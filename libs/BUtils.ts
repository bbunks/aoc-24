export function exp(base: number, exponent: number) {
  let result = 1; //p holds the partial result.
  let s = base; //s holds the current x^2
  let q = exponent; //r is used to compute the binary expansion of y

  while (q > 0) {
    if (q % 2 === 1) result = result * s; //when the binary value of that bit is true, perform action
    s = s * s; //squares s, then mods. This is the intermediary op
    q = Math.floor(q / 2);
  }

  return result;
} //=

export function modExp(base: number, exponent: number, modulus: number) {
  let result = 1; //p holds the partial result.
  let s = base; //s holds the current x^2
  let r = exponent; //r is used to compute the binary expansion of y

  while (r > 0) {
    if (r % 2 === 1) result = (result * s) % modulus; //when the binary value of that bit is true, perform action
    s = (s * s) % modulus; //squares s, then mods. This is the intermediary op
    r = Math.floor(r / 2);
  }

  return result;
}

export async function time(func: () => void) {
  const startTime = Date.now();
  await func();
  const stopTime = Date.now();

  return stopTime - startTime;
}

export function mod(base: number, mod: number) {
  const out = base % mod;
  return out < 0 ? out + mod : out;
}

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function reverse(arr: any[]) {
  const out = [...arr];
  out.reverse();
  return out;
}
