import { Command, GridState, CellColor } from '@/features/sudoku/model/types';
import { GridFactory } from '@/features/sudoku/model/gridFactory';

export class SetValueCommand implements Command {
  private previousState: GridState;
  private newState: GridState;
  
  constructor(
    currentState: GridState,
    positions: readonly { row: number; col: number }[],
    value: number | null
  ) {
    this.previousState = currentState;
    
    const newGrid = GridFactory.updateMultipleCells(
      currentState.grid,
      positions,
      { value, cornerNotes: [], centerNotes: [] }
    );
    
    this.newState = {
      ...currentState,
      grid: newGrid
    };
  }
  
  execute(): GridState {
    return this.newState;
  }
  
  undo(): GridState {
    return this.previousState;
  }
}

export class SetCornerNotesCommand implements Command {
  private previousState: GridState;
  private newState: GridState;
  
  constructor(
    currentState: GridState,
    positions: readonly { row: number; col: number }[],
    notes: number[]
  ) {
    this.previousState = currentState;
    
    const newGrid = GridFactory.updateMultipleCells(
      currentState.grid,
      positions,
      { cornerNotes: notes }
    );
    
    this.newState = {
      ...currentState,
      grid: newGrid
    };
  }
  
  execute(): GridState {
    return this.newState;
  }
  
  undo(): GridState {
    return this.previousState;
  }
}

export class SetCenterNotesCommand implements Command {
  private previousState: GridState;
  private newState: GridState;
  
  constructor(
    currentState: GridState,
    positions: readonly { row: number; col: number }[],
    notes: number[]
  ) {
    this.previousState = currentState;
    
    const newGrid = GridFactory.updateMultipleCells(
      currentState.grid,
      positions,
      { centerNotes: notes }
    );
    
    this.newState = {
      ...currentState,
      grid: newGrid
    };
  }
  
  execute(): GridState {
    return this.newState;
  }
  
  undo(): GridState {
    return this.previousState;
  }
}

export class SetColorCommand implements Command {
  private previousState: GridState;
  private newState: GridState;
  
  constructor(
    currentState: GridState,
    positions: readonly { row: number; col: number }[],
    color: CellColor | null
  ) {
    this.previousState = currentState;
    
    const newGrid = GridFactory.updateMultipleCells(
      currentState.grid,
      positions,
      { color }
    );
    
    this.newState = {
      ...currentState,
      grid: newGrid
    };
  }
  
  execute(): GridState {
    return this.newState;
  }
  
  undo(): GridState {
    return this.previousState;
  }
}
export class SetGridStateCommand implements Command {
  constructor(
    private readonly previousState: GridState,
    private readonly newState: GridState
  ) {}

  execute(): GridState {
    return this.newState;
  }

  undo(): GridState {
    return this.previousState;
  }
}
