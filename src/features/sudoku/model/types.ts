export interface Cell {
  readonly row: number;
  readonly col: number;
  readonly value: number | null;
  readonly cornerNotes: readonly number[];
  readonly centerNotes: readonly number[];
  readonly color: CellColor | null;
}

export type CellColor = 
  | 'red' | 'blue' | 'green' | 'yellow' 
  | 'purple' | 'orange' | 'pink' | 'cyan' | 'lime';

export interface SudokuGrid {
  readonly cells: readonly Cell[][];
}

export interface GridState {
  readonly grid: SudokuGrid;
  readonly selectedCells: readonly { row: number; col: number }[];
  readonly errors: readonly { row: number; col: number }[];
}

export type NotationMode = 'value' | 'corner' | 'center' | 'color';

export interface Command {
  execute(): GridState;
  undo(): GridState;
}