import { Cell, SudokuGrid } from '@/features/sudoku/model/types';
import { SudokuGenerator } from './sudokuGenerator';

export class GridFactory {
  static createEmptyGrid(): SudokuGrid {
    const cells: Cell[][] = [];
    
    for (let row = 0; row < 9; row++) {
      cells[row] = [];
      for (let col = 0; col < 9; col++) {
        cells[row][col] = this.createEmptyCell(row, col);
      }
    }
    
    return { cells };
  }
  
  static createEmptyCell(row: number, col: number): Cell {
    return {
      row,
      col,
      value: null,
      isGiven: false,
      cornerNotes: [],
      centerNotes: [],
      color: null
    };
  }
  
  static updateCell(cell: Cell, updates: Partial<Omit<Cell, 'row' | 'col'>>): Cell {
    return {
      ...cell,
      ...updates
    };
  }
  
  static updateGrid(grid: SudokuGrid, row: number, col: number, updates: Partial<Omit<Cell, 'row' | 'col'>>): SudokuGrid {
    const newCells = grid.cells.map((rowCells, r) =>
      rowCells.map((cell, c) =>
        r === row && c === col ? this.updateCell(cell, updates) : cell
      )
    );
    
    return { cells: newCells };
  }
  
  static updateMultipleCells(
    grid: SudokuGrid, 
    positions: readonly { row: number; col: number }[], 
    updates: Partial<Omit<Cell, 'row' | 'col'>>
  ): SudokuGrid {
    const positionSet = new Set(positions.map(p => `${p.row},${p.col}`));
    
    const newCells = grid.cells.map((rowCells, r) =>
      rowCells.map((cell, c) =>
        positionSet.has(`${r},${c}`) ? this.updateCell(cell, updates) : cell
      )
    );
    
    return { cells: newCells };
  }
  
  static createGridFromNumbers(numbers: number[][]): SudokuGrid {
    const cells: Cell[][] = [];
    
    for (let row = 0; row < 9; row++) {
      cells[row] = [];
      for (let col = 0; col < 9; col++) {
        const value = numbers[row][col] === 0 ? null : numbers[row][col];
        cells[row][col] = {
          row,
          col,
          value,
          isGiven: value !== null,
          cornerNotes: [],
          centerNotes: [],
          color: null
        };
      }
    }
    
    return { cells };
  }
  
  static generatePuzzle(difficulty: string = 'moyen'): SudokuGrid {
    return this.generatePuzzleWithSolution(difficulty).grid;
  }

  static generatePuzzleWithSolution(difficulty: string = 'moyen'): { grid: SudokuGrid; solution: number[][] } {
    const { puzzle, solution } = SudokuGenerator.generatePuzzle(difficulty);
    return {
      grid: this.createGridFromNumbers(puzzle),
      solution
    };
  }
  
  static generateSamplePuzzle(): SudokuGrid {
    return this.generateSamplePuzzleWithSolution().grid;
  }

  static generateSamplePuzzleWithSolution(): { grid: SudokuGrid; solution: number[][] } {
    const { puzzle, solution } = SudokuGenerator.generateSamplePuzzle();
    return {
      grid: this.createGridFromNumbers(puzzle),
      solution
    };
  }
}