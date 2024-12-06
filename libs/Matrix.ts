import { range } from "./BRange.ts";

export class Matrix {
  rowCount: number;
  columnCount: number;
  data: number[][];

  constructor(data: number[][]) {
    this.rowCount = data.length;
    this.columnCount = data[0].length;

    this.data = data.map((row) => {
      while (row.length < this.columnCount) row.push(0);

      return row.slice(0, this.columnCount);
    });
  }

  getValuesInRow(row: number) {
    return this.data[row];
  }

  getValuesInColumn(column: number) {
    return this.data.map((row) => row[column]);
  }

  getValueFromCords(col: number, row: number) {
    return this.data[row][col];
  }

  setValueAtCords(col: number, row: number, value: number) {
    this.data[row][col] = value;
  }

  add(matrix: Matrix) {
    if (
      this.rowCount !== matrix.rowCount ||
      this.columnCount !== matrix.columnCount
    )
      throw new Error("Matrices are not the same size.");

    return this.map((v, r, c) => v + matrix.getValueFromCords(r, c));
  }

  multiply(matrix: Matrix) {
    // this * arg
    if (this.columnCount !== matrix.rowCount)
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
    const outMatrix = createFromDimensions(this.rowCount, this.columnCount);

    this.forEach((value, x, y) => {
      outMatrix.setValueAtCords(x, y, cb(value, x, y));
    });

    return outMatrix;
  }

  toString() {
    const columnWidths = range(0, this.columnCount - 1).value.map((col) => {
      return this.getValuesInColumn(col).reduce((prev, curr) => {
        const valLength = curr.toString().length;
        if (valLength > prev) return valLength;
        return prev;
      }, 0);
    });

    const ends =
      this.rowCount === 1
        ? ["]"]
        : ["⎤", ...range(1, this.columnCount - 2).value.map(() => "⎥"), "⎦"];
    const rows = (
      this.rowCount === 1
        ? ["["]
        : ["⎡", ...range(1, this.columnCount - 2).value.map(() => "⎢"), "⎣"]
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
}

export function createFromDimensions(rowCount: number, columnCount: number) {
  const data = range(1, rowCount).value.map(() => {
    return range(1, columnCount).value.map(() => 0);
  });

  return new Matrix(data);
}

export function createIdentityMatrix(size: number) {
  const data = range(1, size).value.map((v, i) => {
    return range(1, size).value.map((v, j) => (i === j ? 1 : 0));
  });

  return new Matrix(data);
}
