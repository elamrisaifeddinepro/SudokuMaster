import { describe, expect, it } from 'vitest';
import { DIFFICULTY_LEVELS, SudokuGenerator } from './sudokuGenerator';

const GRID_SIZE = 9;
const BOX_SIZE = 3;

function countEmptyCells(grid: number[][]): number {
  return grid.flat().filter(value => value === 0).length;
}

function getValues(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

function expectValidSolvedGrid(grid: number[][]): void {
  expect(grid).toHaveLength(GRID_SIZE);

  const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let row = 0; row < GRID_SIZE; row++) {
    expect(grid[row]).toHaveLength(GRID_SIZE);
    expect(getValues(grid[row])).toEqual(expected);
  }

  for (let col = 0; col < GRID_SIZE; col++) {
    const column = grid.map(row => row[col]);
    expect(getValues(column)).toEqual(expected);
  }

  for (let boxRow = 0; boxRow < GRID_SIZE; boxRow += BOX_SIZE) {
    for (let boxCol = 0; boxCol < GRID_SIZE; boxCol += BOX_SIZE) {
      const boxValues: number[] = [];

      for (let row = boxRow; row < boxRow + BOX_SIZE; row++) {
        for (let col = boxCol; col < boxCol + BOX_SIZE; col++) {
          boxValues.push(grid[row][col]);
        }
      }

      expect(getValues(boxValues)).toEqual(expected);
    }
  }
}

describe('SudokuGenerator', () => {
  it('generates a valid solved grid for the official solution', () => {
    const { solution } = SudokuGenerator.generatePuzzle('facile');

    expectValidSolvedGrid(solution);
  });

  it('keeps the puzzle clues aligned with the official solution', () => {
    const { puzzle, solution } = SudokuGenerator.generatePuzzle('moyen');

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (puzzle[row][col] !== 0) {
          expect(puzzle[row][col]).toBe(solution[row][col]);
        }
      }
    }
  });

  it('removes the expected number of cells for easy difficulty', () => {
    const { puzzle } = SudokuGenerator.generatePuzzle('facile');

    expect(countEmptyCells(puzzle)).toBe(DIFFICULTY_LEVELS.facile.cellsToRemove);
  });

  it('falls back to medium difficulty when the difficulty is unknown', () => {
    const { puzzle } = SudokuGenerator.generatePuzzle('unknown');

    expect(countEmptyCells(puzzle)).toBe(DIFFICULTY_LEVELS.moyen.cellsToRemove);
  });

  it('generates a valid solved grid for the sample puzzle', () => {
    const { puzzle, solution } = SudokuGenerator.generateSamplePuzzle();

    expectValidSolvedGrid(solution);
    expect(countEmptyCells(puzzle)).toBeGreaterThan(0);
  });
});
