import { describe, expect, it } from 'vitest';
import { GridFactory } from './gridFactory';

describe('GridFactory', () => {
  it('creates an empty 9x9 grid', () => {
    const grid = GridFactory.createEmptyGrid();

    expect(grid.cells).toHaveLength(9);
    expect(grid.cells[0]).toHaveLength(9);
    expect(grid.cells[4][7]).toMatchObject({
      row: 4,
      col: 7,
      value: null,
      isGiven: false,
      cornerNotes: [],
      centerNotes: [],
      color: null
    });
  });

  it('marks non-zero puzzle values as given cells', () => {
    const grid = GridFactory.createGridFromNumbers([
      [5, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 9]
    ]);

    expect(grid.cells[0][0]).toMatchObject({ value: 5, isGiven: true });
    expect(grid.cells[0][1]).toMatchObject({ value: null, isGiven: false });
    expect(grid.cells[8][8]).toMatchObject({ value: 9, isGiven: true });
  });

  it('updates one cell immutably', () => {
    const grid = GridFactory.createEmptyGrid();
    const updated = GridFactory.updateGrid(grid, 1, 2, { value: 7 });

    expect(updated.cells[1][2].value).toBe(7);
    expect(grid.cells[1][2].value).toBeNull();
    expect(updated.cells).not.toBe(grid.cells);
  });

  it('updates multiple cells immutably', () => {
    const grid = GridFactory.createEmptyGrid();
    const updated = GridFactory.updateMultipleCells(
      grid,
      [
        { row: 0, col: 0 },
        { row: 8, col: 8 }
      ],
      { color: 'cyan' }
    );

    expect(updated.cells[0][0].color).toBe('cyan');
    expect(updated.cells[8][8].color).toBe('cyan');
    expect(updated.cells[4][4].color).toBeNull();
    expect(grid.cells[0][0].color).toBeNull();
  });
});
