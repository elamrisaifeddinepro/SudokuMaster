import type { Digit, SudokuGrid } from '@/features/sudoku/model/types';
import type { Difficulty } from '@/features/sudoku/ui/panels/DifficultySelector';

type Num = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type GridNum = Num[][];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function emptyGrid(): GridNum {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0 as Num));
}

function isSafe(grid: GridNum, r: number, c: number, n: Num): boolean {
  // row
  for (let x = 0; x < 9; x++) if (grid[r][x] === n) return false;
  // col
  for (let y = 0; y < 9; y++) if (grid[y][c] === n) return false;
  // box
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) if (grid[br + y][bc + x] === n) return false;

  return true;
}

function findEmpty(grid: GridNum): { r: number; c: number } | null {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (grid[r][c] === 0) return { r, c };
  return null;
}

function solve(grid: GridNum): boolean {
  const pos = findEmpty(grid);
  if (!pos) return true;

  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9] as Num[]);
  for (const n of nums) {
    if (isSafe(grid, pos.r, pos.c, n)) {
      grid[pos.r][pos.c] = n;
      if (solve(grid)) return true;
      grid[pos.r][pos.c] = 0;
    }
  }
  return false;
}

function cloneGrid(g: GridNum): GridNum {
  return g.map((row) => row.slice()) as GridNum;
}

function givensTarget(d: Difficulty): number {
  switch (d) {
    case 'easy':
      return 40;
    case 'medium':
      return 32;
    case 'hard':
      return 26;
    case 'expert':
      return 22;
    default:
      return 32;
  }
}

function removeCells(solved: GridNum, targetGivens: number): GridNum {
  const puzzle = cloneGrid(solved);
  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => i)
  );

  let givens = 81;
  for (const idx of positions) {
    if (givens <= targetGivens) break;
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    if (puzzle[r][c] === 0) continue;
    puzzle[r][c] = 0;
    givens--;
  }
  return puzzle;
}

function toDigit(n: number): Digit {
  return n as Digit;
}

export function createPuzzleGrid(difficulty: Difficulty): SudokuGrid {
  const solved = emptyGrid();
  // generate a full solution
  solve(solved);

  const puzzleNums = removeCells(solved, givensTarget(difficulty));

  // convert to SudokuGrid (Cell objects)
  const grid: SudokuGrid = puzzleNums.map((row, r) =>
    row.map((v, c) => {
      const value = v === 0 ? null : toDigit(v);
      return {
        row: r,
        col: c,
        value,
        given: value !== null,
        cornerNotes: [],
        centerNotes: [],
      };
    })
  ) as SudokuGrid;

  return grid;
}