import { exp, getRandomNumber, mod, modExp } from "./BUtils";

export function isPrime(value: number) {
  const t = Math.sqrt(value);
  for (let i = 2; i < t; i++) {
    if (value % i === 0) return false;
  }
  return true;
}

export function findGCD(value1: number, value2: number) {
  const store = [value1, value2];
  while (store[1] > 0) {
    store.push(store[0] % store[1]);
    store.shift();
  }

  return store[0];
}

export function getExtendedGCD(
  value1: number,
  value2: number
): {
  gcd: number;
  val1Co: number;
  val2Co: number;
} {
  if (value1 === 0) {
    return { gcd: value2, val1Co: 0, val2Co: 1 };
  } else {
    const { gcd, val1Co, val2Co } = getExtendedGCD(mod(value2, value1), value1);
    return {
      gcd,
      val1Co: val2Co - Math.floor(value2 / value1) * val1Co,
      val2Co: val1Co,
    };
  }
}

export function getModInverse(value1: number, value2: number) {
  const { gcd, val1Co, val2Co } = getExtendedGCD(value1, value2);

  if (gcd !== 1) throw new Error("The GCD is not 1");

  const out = mod(val1Co, value2);
  return out;
} //=

const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  " ",
];

export function encode(plaintext: string) {
  const out = plaintext
    .toUpperCase()
    .split("")
    .map((c) => (ALPHABET.indexOf(c) + 65).toString().padStart(2, "0"))
    .join("");
  return parseInt(out);
}

export function decode(ciphertext: number) {
  const str = ciphertext.toString();
  return (
    str
      .padStart(str.length + (str.length % 2 === 1 ? 1 : 0), "0")
      .match(/(..?)/g) ?? ["27"]
  )
    .map((v) => ALPHABET[parseInt(v) - 65])
    .join("");
}

export const PrivateKey = {
  encrypt(encodedText: number, SECRET: number) {
    const k = 2191;

    return mod(encodedText + k, SECRET);
  },

  decrypt(ciphertext: number, SECRET: number) {
    const k = 2191;

    return mod(ciphertext - k, SECRET);
  },
};

function generateRandomLargePrime() {
  let randomPrime: number;
  const min = 1e3;
  const max = 1e4;

  do {
    randomPrime = getRandomNumber(min, max);
  } while (!isPrime(randomPrime));

  return randomPrime;
}

// Example usage: Generate a random prime number between 10^9 and 10^10

export const PublicKey = {
  generateKeys(r1: number, r2: number, eO: number) {
    const p1 = r1 ?? generateRandomLargePrime();
    const p2 = r2 ?? generateRandomLargePrime();

    const N = p1 * p2;
    const phi = (p1 - 1) * (p2 - 1);

    let e = eO ?? getRandomNumber(1e4, 1e5);

    while (findGCD(e, phi) !== 1) {
      e = getRandomNumber(1e4, 1e5);
    }

    const inv = getModInverse(e, phi); //=

    return {
      private: inv,
      public: { N, e },
    }; //=
  },
  encrypt(msg: number, N: number, e: number) {
    msg;
    N;
    e;
    return modExp(msg, e, N);
  },
  decrpyt(msg: number, N: number, d: number) {
    msg;
    N;
    d;
    return modExp(msg, d, N);
  },
};
