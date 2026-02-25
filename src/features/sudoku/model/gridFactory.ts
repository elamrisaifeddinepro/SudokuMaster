import type { Cell, CellValue, ColIndex, RowIndex, SudokuGrid } from './types';

const ROWS: RowIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const COLS: ColIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function createEmptyGrid(): SudokuGrid {
  return ROWS.map((r) =>
    COLS.map((c) => ({
      row: r,
      col: c,
      value: null,
      given: false,
    }))
  );
}

/**
 * Grille "mock" (quelques valeurs fixes) pour tester l’affichage.
 * Le vrai générateur viendra plus tard.
 */
export function createMockGrid(): SudokuGrid {
  const grid = createEmptyGrid();

  setCellValue(grid, 0, 0, 5, true);
  setCellValue(grid, 0, 1, 3, true);
  setCellValue(grid, 1, 0, 6, true);
  setCellValue(grid, 4, 4, 7, true);
  setCellValue(grid, 8, 8, 9, true);

  return grid;
}

function setCellValue(
  grid: SudokuGrid,
  row: RowIndex,
  col: ColIndex,
  value: Exclude<CellValue, null>,
  given: boolean
) {
  const cell: Cell = { ...grid[row][col], value, given };
  grid[row][col] = cell;
}

/** Copie immuable d’une grille (utile pour React state plus tard) */
export function cloneGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}