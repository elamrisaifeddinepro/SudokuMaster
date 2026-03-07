import { SudokuGrid, Cell } from '@/features/sudoku/model/types';

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
  
  static isGridSolved(grid: SudokuGrid): boolean {
    // Grid must be complete and have no errors
    return this.isGridComplete(grid) && this.validateGrid(grid).length === 0;
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
    for (const [value, cols] of seen) {
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
    for (const [value, rows] of seen) {
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
    for (const [value, positions] of seen) {
      if (positions.length > 1) {
        duplicates.push(...positions);
      }
    }
    
    return duplicates;
  }
}