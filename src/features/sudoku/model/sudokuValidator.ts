import { SudokuGrid } from '@/features/sudoku/model/types';

export class SudokuValidator {
  static validateGrid(grid: SudokuGrid): { row: number; col: number }[] {
    const errors: { row: number; col: number }[] = [];
    
    // Check rows
    for (let row = 0; row < 9; row++) {
      const duplicates = this.findDuplicatesInRow(grid, row);
      errors.push(...duplicates);
    }
    
    // Check columns
    for (let col = 0; col < 9; col++) {
      const duplicates = this.findDuplicatesInColumn(grid, col);
      errors.push(...duplicates);
    }
    
    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const duplicates = this.findDuplicatesInBox(grid, boxRow, boxCol);
        errors.push(...duplicates);
      }
    }
    
    return errors;
  }
  
  static validateGridWithSolution(grid: SudokuGrid, solution?: readonly (readonly number[])[]): { row: number; col: number }[] {
    const errors = this.uniquePositions(this.validateGrid(grid));

    if (!solution) {
      return errors;
    }

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = grid.cells[row][col].value;
        if (value !== null && value !== solution[row][col]) {
          errors.push({ row, col });
        }
      }
    }

    return this.uniquePositions(errors);
  }

  static isGridComplete(grid: SudokuGrid): boolean {
    // Check if all cells are filled
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid.cells[row][col].value === null) {
          return false;
        }
      }
    }
    return true;
  }
  
  static isGridSolved(grid: SudokuGrid, solution?: readonly (readonly number[])[]): boolean {
    if (!this.isGridComplete(grid)) {
      return false;
    }

    if (solution) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid.cells[row][col].value !== solution[row][col]) {
            return false;
          }
        }
      }
      return true;
    }

    // Fallback for older save files without official solution.
    return this.validateGrid(grid).length === 0;
  }
  
  private static uniquePositions(positions: { row: number; col: number }[]): { row: number; col: number }[] {
    const seen = new Set<string>();
    const unique: { row: number; col: number }[] = [];

    for (const position of positions) {
      const key = `${position.row}-${position.col}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(position);
      }
    }

    return unique;
  }

  private static findDuplicatesInRow(grid: SudokuGrid, row: number): { row: number; col: number }[] {
    const seen = new Map<number, number[]>();
    
    for (let col = 0; col < 9; col++) {
      const cell = grid.cells[row][col];
      if (cell.value !== null) {
        if (!seen.has(cell.value)) {
          seen.set(cell.value, []);
        }
        seen.get(cell.value)!.push(col);
      }
    }
    
    const duplicates: { row: number; col: number }[] = [];
    for (const cols of seen.values()) {
      if (cols.length > 1) {
        cols.forEach(col => duplicates.push({ row, col }));
      }
    }
    
    return duplicates;
  }
  
  private static findDuplicatesInColumn(grid: SudokuGrid, col: number): { row: number; col: number }[] {
    const seen = new Map<number, number[]>();
    
    for (let row = 0; row < 9; row++) {
      const cell = grid.cells[row][col];
      if (cell.value !== null) {
        if (!seen.has(cell.value)) {
          seen.set(cell.value, []);
        }
        seen.get(cell.value)!.push(row);
      }
    }
    
    const duplicates: { row: number; col: number }[] = [];
    for (const rows of seen.values()) {
      if (rows.length > 1) {
        rows.forEach(row => duplicates.push({ row, col }));
      }
    }
    
    return duplicates;
  }
  
  private static findDuplicatesInBox(grid: SudokuGrid, boxRow: number, boxCol: number): { row: number; col: number }[] {
    const seen = new Map<number, { row: number; col: number }[]>();
    
    for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
      for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
        const cell = grid.cells[r][c];
        if (cell.value !== null) {
          if (!seen.has(cell.value)) {
            seen.set(cell.value, []);
          }
          seen.get(cell.value)!.push({ row: r, col: c });
        }
      }
    }
    
    const duplicates: { row: number; col: number }[] = [];
    for (const positions of seen.values()) {
      if (positions.length > 1) {
        duplicates.push(...positions);
      }
    }
    
    return duplicates;
  }
}