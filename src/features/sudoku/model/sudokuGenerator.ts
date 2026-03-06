import type { Digit, SudokuGrid } from '@/features/sudoku/model/types';
import type { Difficulty } from '@/features/sudoku/ui/panels/DifficultySelector';

type Num = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type GridNum = Num[][];

type UniqueResult = {
  grid: SudokuGrid;
  givens: number;
  unique: boolean;
};

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

function isSafe(grid: GridNum, r: number, c: number, n: Num): boolean {
  for (let x = 0; x < 9; x++) if (grid[r][x] === n) return false;
  for (let y = 0; y < 9; y++) if (grid[y][c] === n) return false;

  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) if (grid[br + y][bc + x] === n) return false;

  return true;
}

function findEmpty(grid: GridNum): { r: number; c: number } | null {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (grid[r][c] === 0) return { r, c };
  return null;
}

// Randomized solver to build a full solution
function solveRandom(grid: GridNum): boolean {
  const pos = findEmpty(grid);
  if (!pos) return true;

  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9] as Num[]);
  for (const n of nums) {
    if (isSafe(grid, pos.r, pos.c, n)) {
      grid[pos.r][pos.c] = n;
      if (solveRandom(grid)) return true;
      grid[pos.r][pos.c] = 0;
    }
  }
  return false;
}

function candidates(grid: GridNum, r: number, c: number): Num[] {
  if (grid[r][c] !== 0) return [];
  const cand: Num[] = [];
  for (let n = 1 as Num; n <= 9; n = (n + 1) as Num) {
    if (isSafe(grid, r, c, n)) cand.push(n);
  }
  return cand;
}

// Count solutions (up to 2) with MRV heuristic
function countSolutionsUpTo2(grid: GridNum): number {
  // find empty with min candidates
  let best: { r: number; c: number; cand: Num[] } | null = null;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== 0) continue;
      const cand = candidates(grid, r, c);
      if (cand.length === 0) return 0;
      if (!best || cand.length < best.cand.length) best = { r, c, cand };
      if (best.cand.length === 1) break;
    }
    if (best?.cand.length === 1) break;
  }

  if (!best) return 1; // solved

  let count = 0;
  const cand = shuffle(best.cand);

  for (const n of cand) {
    grid[best.r][best.c] = n;
    count += countSolutionsUpTo2(grid);
    if (count >= 2) {
      grid[best.r][best.c] = 0;
      return 2;
    }
    grid[best.r][best.c] = 0;
  }

  return count;
}

function toDigit(n: number): Digit {
  return n as Digit;
}

function toSudokuGrid(puzzleNums: GridNum): SudokuGrid {
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

function countGivensNums(puzzle: GridNum): number {
  let g = 0;
  for (const row of puzzle) for (const v of row) if (v !== 0) g++;
  return g;
}

// Best-effort unique puzzle generation
export function createUniquePuzzleGrid(difficulty: Difficulty): UniqueResult {
  const solved = emptyGrid();
  solveRandom(solved);

  const target = givensTarget(difficulty);
  const puzzle = cloneGrid(solved);

  // positions shuffled
  const positions = shuffle(Array.from({ length: 81 }, (_, i) => i));

  let givens = 81;
  let unique = true;

  // limit checks to avoid long freezes
  let checks = 0;
  const MAX_CHECKS = 140;

  for (const idx of positions) {
    if (givens <= target) break;
    if (checks >= MAX_CHECKS) break;

    const r = Math.floor(idx / 9);
    const c = idx % 9;
    if (puzzle[r][c] === 0) continue;

    const backup = puzzle[r][c];
    puzzle[r][c] = 0;

    // uniqueness test
    const test = cloneGrid(puzzle);
    const solCount = countSolutionsUpTo2(test);
    checks++;

    if (solCount !== 1) {
      // revert if not unique
      puzzle[r][c] = backup;
      unique = false; // we attempted but couldn't keep uniqueness for this removal
      continue;
    }

    givens--;
  }

  // If we couldn't reach target, still return what we achieved (unique best-effort)
  const resultGivens = countGivensNums(puzzle);
    return { grid: toSudokuGrid(puzzle), givens: resultGivens, unique };}

// Backward-compatible: just return a puzzle grid (may be non-unique)
export function createPuzzleGrid(difficulty: Difficulty): SudokuGrid {
  return createUniquePuzzleGrid(difficulty).grid;
}