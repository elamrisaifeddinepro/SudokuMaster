import { SudokuGrid, Cell } from '@/features/sudoku/model/types';

export interface Hint {
  type: 'eliminate' | 'naked_single' | 'hidden_single' | 'pointing' | 'basic_technique';
  message: string;
  cells: { row: number; col: number }[];
  value?: number;
  eliminatedValues?: number[];
  technique?: string;
}

export class HintSystem {
  static generateHint(grid: SudokuGrid): Hint | null {
    // Try different hint strategies in order of difficulty
    
    // 1. Look for naked singles (cells with only one possible value)
    const nakedSingle = this.findNakedSingle(grid);
    if (nakedSingle) return nakedSingle;
    
    // 2. Look for hidden singles (value that can only go in one place)
    const hiddenSingle = this.findHiddenSingle(grid);
    if (hiddenSingle) return hiddenSingle;
    
    // 3. Look for basic elimination opportunities
    const elimination = this.findBasicElimination(grid);
    if (elimination) return elimination;
    
    // 4. Look for pointing pairs/triples
    const pointing = this.findPointingPairs(grid);
    if (pointing) return pointing;
    
    return null;
  }
  
  static generateSpecificHint(grid: SudokuGrid, hintType: string): Hint | null {
    switch (hintType) {
      case 'naked_single':
        return this.findNakedSingle(grid);
      case 'hidden_single':
        return this.findHiddenSingle(grid);
      case 'eliminate':
        return this.findBasicElimination(grid);
      case 'pointing':
        return this.findPointingPairs(grid);
      case 'auto':
        return this.generateHint(grid);
      default:
        return this.generateHint(grid);
    }
  }
  
  static getAvailableHintTypes(grid: SudokuGrid): string[] {
    const availableTypes: string[] = [];
    
    if (this.findNakedSingle(grid)) availableTypes.push('naked_single');
    if (this.findHiddenSingle(grid)) availableTypes.push('hidden_single');
    if (this.findBasicElimination(grid)) availableTypes.push('eliminate');
    if (this.findPointingPairs(grid)) availableTypes.push('pointing');
    
    return availableTypes;
  }
  
  private static findNakedSingle(grid: SudokuGrid): Hint | null {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = grid.cells[row][col];
        if (cell.value === null) {
          const possibleValues = this.getPossibleValues(grid, row, col);
          if (possibleValues.length === 1) {
            return {
              type: 'naked_single',
              message: `La cellule en ligne ${row + 1}, colonne ${col + 1} ne peut contenir que le chiffre ${possibleValues[0]}. C'est la seule valeur possible pour cette cellule.`,
              cells: [{ row, col }],
              value: possibleValues[0],
              technique: 'Singleton nu'
            };
          }
        }
      }
    }
    return null;
  }
  
  private static findHiddenSingle(grid: SudokuGrid): Hint | null {
    // Check rows
    for (let row = 0; row < 9; row++) {
      const hint = this.findHiddenSingleInUnit(grid, 'row', row);
      if (hint) return hint;
    }
    
    // Check columns
    for (let col = 0; col < 9; col++) {
      const hint = this.findHiddenSingleInUnit(grid, 'col', col);
      if (hint) return hint;
    }
    
    // Check boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const hint = this.findHiddenSingleInUnit(grid, 'box', boxRow * 3 + boxCol);
        if (hint) return hint;
      }
    }
    
    return null;
  }
  
  private static findHiddenSingleInUnit(grid: SudokuGrid, unitType: 'row' | 'col' | 'box', index: number): Hint | null {
    const cells = this.getUnitCells(unitType, index);
    
    for (let value = 1; value <= 9; value++) {
      const possibleCells: { row: number; col: number }[] = [];
      
      for (const { row, col } of cells) {
        const cell = grid.cells[row][col];
        if (cell.value === null) {
          const possibleValues = this.getPossibleValues(grid, row, col);
          if (possibleValues.includes(value)) {
            possibleCells.push({ row, col });
          }
        }
      }
      
      if (possibleCells.length === 1) {
        const { row, col } = possibleCells[0];
        const unitName = unitType === 'row' ? `ligne ${index + 1}` : 
                        unitType === 'col' ? `colonne ${index + 1}` : 
                        `boîte ${Math.floor(index / 3) + 1}-${(index % 3) + 1}`;
        
        return {
          type: 'hidden_single',
          message: `Le chiffre ${value} ne peut être placé qu'en ligne ${row + 1}, colonne ${col + 1} dans la ${unitName}.`,
          cells: [{ row, col }],
          value,
          technique: 'Singleton caché'
        };
      }
    }
    
    return null;
  }
  
  private static findBasicElimination(grid: SudokuGrid): Hint | null {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = grid.cells[row][col];
        if (cell.value === null) {
          const possibleValues = this.getPossibleValues(grid, row, col);
          const allValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const eliminatedValues = allValues.filter(v => !possibleValues.includes(v));
          
          if (eliminatedValues.length > 0 && possibleValues.length > 1) {
            return {
              type: 'eliminate',
              message: `Dans la cellule ligne ${row + 1}, colonne ${col + 1}, vous pouvez éliminer les chiffres ${eliminatedValues.join(', ')} car ils sont déjà présents dans la ligne, colonne ou boîte.`,
              cells: [{ row, col }],
              eliminatedValues,
              technique: 'Élimination de base'
            };
          }
        }
      }
    }
    return null;
  }
  
  private static findPointingPairs(grid: SudokuGrid): Hint | null {
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        for (let value = 1; value <= 9; value++) {
          const hint = this.findPointingPairInBox(grid, boxRow, boxCol, value);
          if (hint) return hint;
        }
      }
    }
    return null;
  }
  
  private static findPointingPairInBox(grid: SudokuGrid, boxRow: number, boxCol: number, value: number): Hint | null {
    const possibleCells: { row: number; col: number }[] = [];
    
    // Find all cells in the box where this value could go
    for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
      for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
        const cell = grid.cells[r][c];
        if (cell.value === null) {
          const possibleValues = this.getPossibleValues(grid, r, c);
          if (possibleValues.includes(value)) {
            possibleCells.push({ row: r, col: c });
          }
        }
      }
    }
    
    if (possibleCells.length >= 2 && possibleCells.length <= 3) {
      // Check if all possible cells are in the same row
      const sameRow = possibleCells.every(cell => cell.row === possibleCells[0].row);
      if (sameRow) {
        return {
          type: 'pointing',
          message: `Dans la boîte ${boxRow + 1}-${boxCol + 1}, le chiffre ${value} ne peut être placé que dans la ligne ${possibleCells[0].row + 1}. Cela peut vous aider à éliminer ce chiffre ailleurs dans cette ligne.`,
          cells: possibleCells,
          value,
          technique: 'Paire/Triple pointante'
        };
      }
      
      // Check if all possible cells are in the same column
      const sameCol = possibleCells.every(cell => cell.col === possibleCells[0].col);
      if (sameCol) {
        return {
          type: 'pointing',
          message: `Dans la boîte ${boxRow + 1}-${boxCol + 1}, le chiffre ${value} ne peut être placé que dans la colonne ${possibleCells[0].col + 1}. Cela peut vous aider à éliminer ce chiffre ailleurs dans cette colonne.`,
          cells: possibleCells,
          value,
          technique: 'Paire/Triple pointante'
        };
      }
    }
    
    return null;
  }
  
  private static getPossibleValues(grid: SudokuGrid, row: number, col: number): number[] {
    const used = new Set<number>();
    
    // Check row
    for (let c = 0; c < 9; c++) {
      const value = grid.cells[row][c].value;
      if (value !== null) used.add(value);
    }
    
    // Check column
    for (let r = 0; r < 9; r++) {
      const value = grid.cells[r][col].value;
      if (value !== null) used.add(value);
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        const value = grid.cells[r][c].value;
        if (value !== null) used.add(value);
      }
    }
    
    const possible: number[] = [];
    for (let value = 1; value <= 9; value++) {
      if (!used.has(value)) {
        possible.push(value);
      }
    }
    
    return possible;
  }
  
  private static getUnitCells(unitType: 'row' | 'col' | 'box', index: number): { row: number; col: number }[] {
    const cells: { row: number; col: number }[] = [];
    
    if (unitType === 'row') {
      for (let col = 0; col < 9; col++) {
        cells.push({ row: index, col });
      }
    } else if (unitType === 'col') {
      for (let row = 0; row < 9; row++) {
        cells.push({ row, col: index });
      }
    } else if (unitType === 'box') {
      const boxRow = Math.floor(index / 3);
      const boxCol = index % 3;
      for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
        for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
          cells.push({ row: r, col: c });
        }
      }
    }
    
    return cells;
  }
}