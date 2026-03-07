import { SudokuGrid } from '@/features/sudoku/model/types';

export interface SaveData {
  version: string;
  grid: SudokuGrid;
  timestamp: number;
}

export class FileManager {
  private static readonly VERSION = '1.0.0';
  
  static saveGrid(grid: SudokuGrid): string {
    const saveData: SaveData = {
      version: this.VERSION,
      grid,
      timestamp: Date.now()
    };
    
    return JSON.stringify(saveData, null, 2);
  }
  
  static loadGrid(jsonData: string): SudokuGrid {
    try {
      const saveData: SaveData = JSON.parse(jsonData);
      
      if (!saveData.version || !saveData.grid) {
        throw new Error('Invalid save file format');
      }
      
      // Validate grid structure
      if (!this.isValidGridStructure(saveData.grid)) {
        throw new Error('Invalid grid data');
      }
      
      return saveData.grid;
    } catch (error) {
      throw new Error(`Failed to load grid: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private static isValidGridStructure(grid: any): grid is SudokuGrid {
    if (!grid || !Array.isArray(grid.cells)) {
      return false;
    }
    
    if (grid.cells.length !== 9) {
      return false;
    }
    
    for (let row = 0; row < 9; row++) {
      if (!Array.isArray(grid.cells[row]) || grid.cells[row].length !== 9) {
        return false;
      }
      
      for (let col = 0; col < 9; col++) {
        const cell = grid.cells[row][col];
        if (!this.isValidCell(cell, row, col)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  private static isValidCell(cell: any, expectedRow: number, expectedCol: number): boolean {
    return (
      cell &&
      cell.row === expectedRow &&
      cell.col === expectedCol &&
      (cell.value === null || (typeof cell.value === 'number' && cell.value >= 1 && cell.value <= 9)) &&
      Array.isArray(cell.cornerNotes) &&
      Array.isArray(cell.centerNotes) &&
      (cell.color === null || typeof cell.color === 'string')
    );
  }
  
  static downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
  
  static uploadFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          resolve(content);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      };
      
      input.click();
    });
  }
}