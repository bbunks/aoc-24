import { range } from "./BRange.ts";

export class Matrix {
  height: number;
  width: number;
  data: number[][];

  constructor(data: number[][]) {
    this.height = data.length;
    this.width = data[0].length;

    this.data = data.map((row) => {
      while (row.length < this.width) row.push(0);

      return row.slice(0, this.width);
    });
  }

  static blank(width: number, height: number, value = 0) {
    return new Matrix(
      range(0, height - 1).map(() => range(0, width - 1).map(() => value))
    );
  }

  static createIdentityMatrix(size: number) {
    const data = range(1, size).value.map((v, i) => {
      return range(1, size).value.map((v, j) => (i === j ? 1 : 0));
    });

    return new Matrix(data);
  }

  getValuesInRow(y: number) {
    return this.data[y];
  }

  getValuesInColumn(x: number) {
    return this.data.map((row) => row[x]);
  }

  getValueFromCords(x: number, y: number) {
    return this.data[y][x];
  }

  setValueAtCords(x: number, y: number, value: number) {
    this.data[y][x] = value;
  }

  add(matrix: Matrix) {
    if (this.height !== matrix.height || this.width !== matrix.width)
      throw new Error("Matrices are not the same size.");

    return this.map((v, r, c) => v + matrix.getValueFromCords(r, c));
  }

  multiply(matrix: Matrix) {
    // this * arg
    if (this.width !== matrix.height)
      throw new Error("Matrices are not the same size.");

    return matrix.map((v, r, c) => this.getDotProduct(matrix, r, c));
  }

  getDotProduct(matrix: Matrix, row: number, column: number) {
    const v1 = this.getValuesInRow(row);
    const v2 = matrix.getValuesInColumn(column);

    return v1
      .map((f1, i) => {
        return f1 * v2[i];
      })
      .reduce((prev, curr) => prev + curr, 0);
  }

  forEach(cb: (value: number, x: number, y: number) => void) {
    this.data.forEach((row, i) => {
      row.forEach((value, j) => {
        cb(value, j, i);
      });
    });
  }

  map(cb: (value: number, x: number, y: number) => number) {
    const outMatrix = createFromDimensions(this.height, this.width);

    this.forEach((value, x, y) => {
      outMatrix.setValueAtCords(x, y, cb(value, x, y));
    });

    return outMatrix;
  }

  toString() {
    const columnWidths = range(0, this.width - 1).value.map((col) => {
      return this.getValuesInColumn(col).reduce((prev, curr) => {
        const valLength = curr.toString().length;
        if (valLength > prev) return valLength;
        return prev;
      }, 0);
    });

    const ends =
      this.height === 1
        ? ["]"]
        : ["⎤", ...range(1, this.width - 2).map(() => "⎥"), "⎦"];
    const rows = (
      this.height === 1
        ? ["["]
        : ["⎡", ...range(1, this.width - 2).map(() => "⎢"), "⎣"]
    ).map(
      (row, i) =>
        row +
        " " +
        this.getValuesInRow(i)
          .map((val, j) => val.toString().padEnd(columnWidths[j]))
          .join(" ") +
        " " +
        ends[i]
    );
    columnWidths;
    return rows.join("\n");
  }

  rotate90() {
    return this.map((v, x, y) =>
      this.getValueFromCords(y, this.height - x - 1)
    );
  }

  isInBounds(x: number, y: number) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }
}

export function createFromDimensions(height: number, width: number) {
  const data = range(1, height).value.map(() => {
    return range(1, width).value.map(() => 0);
  });

  return new Matrix(data);
}

export function createIdentityMatrix(size: number) {
  const data = range(1, size).value.map((v, i) => {
    return range(1, size).value.map((v, j) => (i === j ? 1 : 0));
  });

  return new Matrix(data);
}
