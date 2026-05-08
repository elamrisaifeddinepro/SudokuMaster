import { describe, expect, it } from 'vitest';
import { GridState } from '@/features/sudoku/model/types';
import { GridFactory } from '../gridFactory';
import { SetCenterNotesCommand, SetColorCommand, SetCornerNotesCommand, SetValueCommand } from './sudokuCommands';

function createState(): GridState {
  return {
    grid: GridFactory.createEmptyGrid(),
    selectedCells: [],
    errors: []
  };
}

describe('Sudoku commands', () => {
  it('sets a value and clears notes', () => {
    let state = createState();
    state = new SetCornerNotesCommand(state, [{ row: 0, col: 0 }], [1, 2]).execute();

    const command = new SetValueCommand(state, [{ row: 0, col: 0 }], 9);
    const next = command.execute();

    expect(next.grid.cells[0][0].value).toBe(9);
    expect(next.grid.cells[0][0].cornerNotes).toEqual([]);
    expect(command.undo()).toBe(state);
  });

  it('sets notes on multiple cells in one command', () => {
    const state = createState();
    const next = new SetCenterNotesCommand(
      state,
      [
        { row: 0, col: 0 },
        { row: 1, col: 1 }
      ],
      [3, 4]
    ).execute();

    expect(next.grid.cells[0][0].centerNotes).toEqual([3, 4]);
    expect(next.grid.cells[1][1].centerNotes).toEqual([3, 4]);
  });

  it('sets a color and supports undo', () => {
    const state = createState();
    const command = new SetColorCommand(state, [{ row: 2, col: 2 }], 'purple');

    expect(command.execute().grid.cells[2][2].color).toBe('purple');
    expect(command.undo().grid.cells[2][2].color).toBeNull();
  });
});
