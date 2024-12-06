// in place sort that returns an array of each iternation
export function SelectionSort(input: number[]) {
  const interationOutputs: number[][] = [];

  for (let i = 0; i < input.length; i++) {
    let smallestIndex = i;
    for (let j = i + 1; j < input.length; j++) {
      if (input[smallestIndex] > input[j]) {
        smallestIndex = j;
      }
    }

    if (smallestIndex !== i) {
      let swap = input[i];
      input[i] = input[smallestIndex];
      input[smallestIndex] = swap;
    }

    interationOutputs.push([...input]);
  }

  return interationOutputs;
}

export function InsertionSort(input: number[]) {
  const interationOutputs: number[][] = [];

  for (let i = 1; i < input.length; i++) {
    let swapIndex = i;
    while (swapIndex > 0 && input[swapIndex] < input[swapIndex - 1]) {
      let swap = input[swapIndex - 1];
      input[swapIndex - 1] = input[swapIndex];
      input[swapIndex] = swap;
      swapIndex--;
    }

    interationOutputs.push([...input]);
  }

  return interationOutputs;
}

export function QuickSort(
  input: number[],
  i = 0,
  k = input.length - 1,
  interationOutputs: number[][] = []
) {
  interationOutputs.push([...input]);
  if (i >= k) {
    return;
  }

  let j = Partition(input, i, k);

  QuickSort(input, i, j, interationOutputs);
  QuickSort(input, j + 1, k, interationOutputs);

  return interationOutputs;
}

function Partition(input: number[], lowerBound: number, upperBound: number) {
  let midpoint = Math.floor((lowerBound + upperBound) / 2);
  let pivot = input[midpoint];

  let low = lowerBound;
  let high = upperBound;

  while (low <= high) {
    while (input[low] < pivot) low++;
    while (input[high] > pivot) high--;

    if (low >= high) break;

    let swap = input[low];
    input[low] = input[high];
    input[high] = swap;
    console.log(input);

    low++;
    high--;
  }
  return high;
}
