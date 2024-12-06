function mod(base: number, modulus: number) {
  let quotient = 0;
  let remainder = base;

  if (base >= modulus) {
    while (remainder >= modulus) {
      quotient++;
      remainder -= modulus;
    }
  } else if (base < 0) {
    while (remainder <= -modulus) {
      quotient--;
      remainder += modulus;
      // console.log("r", remainder);
    }
  }

  return remainder;
}

function div(numerator: number, denomonator: number) {
  let quotient = 0;
  let remainder = numerator;

  if (numerator >= denomonator) {
    while (remainder >= 0) {
      quotient++;
      remainder -= denomonator;
    }
  } else if (numerator < 0) {
    while (remainder <= -denomonator) {
      quotient--;
      remainder += denomonator;
      // console.log("r", remainder);
    }
  }

  return quotient;
}

mod(7, 7); //=
mod(-7, 8); //=
div(47, 7); //=
