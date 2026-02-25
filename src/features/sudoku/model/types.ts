export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type RowIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ColIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type CellValue = Digit | null;

export interface Cell {
  row: RowIndex;
  col: ColIndex;
  value: CellValue;
  given: boolean; // true = valeur initiale non modifiable
}

export type SudokuGrid = Cell[][]; // 9x9

export interface Position {
  row: RowIndex;
  col: ColIndex;
}