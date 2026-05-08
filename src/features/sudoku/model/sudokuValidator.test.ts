import { describe, expect, it } from 'vitest';
import { GridFactory } from './gridFactory';
import { SudokuValidator } from './sudokuValidator';

const solvedGrid = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

describe('SudokuValidator', () => {
  it('detects a solved grid', () => {
    const grid = GridFactory.createGridFromNumbers(solvedGrid);

    expect(SudokuValidator.isGridComplete(grid)).toBe(true);
    expect(SudokuValidator.isGridSolved(grid, solvedGrid)).toBe(true);
    expect(SudokuValidator.validateGridWithSolution(grid, solvedGrid)).toEqual([]);
  });

  it('detects duplicate values in a row', () => {
    const numbers = solvedGrid.map(row => [...row]);
    numbers[0][1] = 5;
    const grid = GridFactory.createGridFromNumbers(numbers);

    expect(SudokuValidator.validateGrid(grid)).toEqual(
      expect.arrayContaining([
        { row: 0, col: 0 },
        { row: 0, col: 1 }
      ])
    );
  });

  it('detects a wrong value by comparing with the official solution', () => {
    const numbers = solvedGrid.map(row => [...row]);
    numbers[0][0] = 4;
    const grid = GridFactory.createGridFromNumbers(numbers);

    expect(SudokuValidator.validateGridWithSolution(grid, solvedGrid)).toContainEqual({ row: 0, col: 0 });
    expect(SudokuValidator.isGridSolved(grid, solvedGrid)).toBe(false);
  });

  it('does not mark an incomplete grid as solved', () => {
    const numbers = solvedGrid.map(row => [...row]);
    numbers[8][8] = 0;
    const grid = GridFactory.createGridFromNumbers(numbers);

    expect(SudokuValidator.isGridComplete(grid)).toBe(false);
    expect(SudokuValidator.isGridSolved(grid, solvedGrid)).toBe(false);
  });
});
