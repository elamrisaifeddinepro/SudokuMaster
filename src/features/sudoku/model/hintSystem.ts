import { SudokuGrid } from '@/features/sudoku/model/types';

export type HintType =
  | 'eliminate'
  | 'naked_single'
  | 'hidden_single'
  | 'naked_pair'
  | 'pointing'
  | 'basic_technique'
  | 'blocked';

type Position = { row: number; col: number };
type UnitType = 'row' | 'col' | 'box';

export interface Hint {
  type: HintType;
  message: string;
  cells: Position[];
  value?: number;
  eliminatedValues?: number[];
  technique?: string;
}

export class HintSystem {
  static generateHint(grid: SudokuGrid): Hint | null {
    const nakedSingle = this.findNakedSingle(grid);
    if (nakedSingle) return nakedSingle;

    const hiddenSingle = this.findHiddenSingle(grid);
    if (hiddenSingle) return hiddenSingle;

    const nakedPair = this.findNakedPair(grid);
    if (nakedPair) return nakedPair;

    const pointing = this.findPointingPairs(grid);
    if (pointing) return pointing;

    const elimination = this.findBasicElimination(grid);
    if (elimination) return elimination;

    return null;
  }

  static generateSpecificHint(grid: SudokuGrid, hintType: string): Hint | null {
    switch (hintType) {
      case 'naked_single':
        return this.findNakedSingle(grid);
      case 'hidden_single':
        return this.findHiddenSingle(grid);
      case 'naked_pair':
        return this.findNakedPair(grid);
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
    if (this.findNakedPair(grid)) availableTypes.push('naked_pair');
    if (this.findPointingPairs(grid)) availableTypes.push('pointing');
    if (this.findBasicElimination(grid)) availableTypes.push('eliminate');

    return availableTypes;
  }

  private static findNakedSingle(grid: SudokuGrid): Hint | null {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = grid.cells[row][col];
        if (cell.value !== null) continue;

        const possibleValues = this.getPossibleValues(grid, row, col);
        if (possibleValues.length === 1) {
          return {
            type: 'naked_single',
            message: `L${row + 1}C${col + 1} ne possède qu'un seul candidat possible : ${possibleValues[0]}. Les autres chiffres sont déjà bloqués par sa ligne, sa colonne ou sa boîte.`,
            cells: [{ row, col }],
            value: possibleValues[0],
            technique: 'Singleton nu'
          };
        }
      }
    }

    return null;
  }

  private static findHiddenSingle(grid: SudokuGrid): Hint | null {
    for (let row = 0; row < 9; row++) {
      const hint = this.findHiddenSingleInUnit(grid, 'row', row);
      if (hint) return hint;
    }

    for (let col = 0; col < 9; col++) {
      const hint = this.findHiddenSingleInUnit(grid, 'col', col);
      if (hint) return hint;
    }

    for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
      const hint = this.findHiddenSingleInUnit(grid, 'box', boxIndex);
      if (hint) return hint;
    }

    return null;
  }

  private static findHiddenSingleInUnit(grid: SudokuGrid, unitType: UnitType, index: number): Hint | null {
    const cells = this.getUnitCells(unitType, index);

    for (let value = 1; value <= 9; value++) {
      const possibleCells = cells.filter(({ row, col }) => (
        grid.cells[row][col].value === null && this.getPossibleValues(grid, row, col).includes(value)
      ));

      if (possibleCells.length === 1) {
        const { row, col } = possibleCells[0];
        const unitName = this.getUnitName(unitType, index);

        return {
          type: 'hidden_single',
          message: `Dans ${unitName}, le chiffre ${value} ne peut aller qu'en L${row + 1}C${col + 1}. Même si cette cellule a plusieurs candidats, ${value} est unique dans cette unité.`,
          cells: [{ row, col }],
          value,
          technique: 'Singleton caché'
        };
      }
    }

    return null;
  }

  private static findNakedPair(grid: SudokuGrid): Hint | null {
    const units: { type: UnitType; index: number }[] = [];
    for (let index = 0; index < 9; index++) {
      units.push({ type: 'row', index }, { type: 'col', index }, { type: 'box', index });
    }

    for (const unit of units) {
      const hint = this.findNakedPairInUnit(grid, unit.type, unit.index);
      if (hint) return hint;
    }

    return null;
  }

  private static findNakedPairInUnit(grid: SudokuGrid, unitType: UnitType, index: number): Hint | null {
    const cells = this.getUnitCells(unitType, index);
    const pairCandidates = cells
      .map(position => ({ position, candidates: this.getPossibleValues(grid, position.row, position.col) }))
      .filter(({ position, candidates }) => grid.cells[position.row][position.col].value === null && candidates.length === 2);

    for (let i = 0; i < pairCandidates.length; i++) {
      for (let j = i + 1; j < pairCandidates.length; j++) {
        const first = pairCandidates[i];
        const second = pairCandidates[j];

        if (!this.sameValues(first.candidates, second.candidates)) continue;

        const affectedCells = cells.filter(({ row, col }) => {
          const isPairCell = (
            (row === first.position.row && col === first.position.col) ||
            (row === second.position.row && col === second.position.col)
          );
          if (isPairCell || grid.cells[row][col].value !== null) return false;

          const candidates = this.getPossibleValues(grid, row, col);
          return first.candidates.some(value => candidates.includes(value));
        });

        if (affectedCells.length === 0) continue;

        return {
          type: 'naked_pair',
          message: `Dans ${this.getUnitName(unitType, index)}, L${first.position.row + 1}C${first.position.col + 1} et L${second.position.row + 1}C${second.position.col + 1} partagent exactement les candidats ${first.candidates.join(' et ')}. Ces chiffres peuvent donc être éliminés des autres cellules de cette unité.`,
          cells: [first.position, second.position, ...affectedCells],
          eliminatedValues: first.candidates,
          technique: 'Paire nue'
        };
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
    const possibleCells: Position[] = [];

    for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
      for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
        if (grid.cells[row][col].value === null && this.getPossibleValues(grid, row, col).includes(value)) {
          possibleCells.push({ row, col });
        }
      }
    }

    if (possibleCells.length < 2 || possibleCells.length > 3) return null;

    const sameRow = possibleCells.every(cell => cell.row === possibleCells[0].row);
    if (sameRow) {
      const row = possibleCells[0].row;
      const affectedCells = this.getRowCells(row).filter(({ row: r, col }) => (
        !this.isInBox(r, col, boxRow, boxCol) &&
        grid.cells[r][col].value === null &&
        this.getPossibleValues(grid, r, col).includes(value)
      ));

      if (affectedCells.length > 0) {
        return {
          type: 'pointing',
          message: `Dans la boîte ${boxRow + 1}-${boxCol + 1}, le chiffre ${value} est forcément sur la ligne ${row + 1}. Il peut donc être éliminé des autres cellules de cette ligne hors de la boîte.`,
          cells: [...possibleCells, ...affectedCells],
          value,
          eliminatedValues: [value],
          technique: 'Paire/Triple pointante'
        };
      }
    }

    const sameCol = possibleCells.every(cell => cell.col === possibleCells[0].col);
    if (sameCol) {
      const col = possibleCells[0].col;
      const affectedCells = this.getColumnCells(col).filter(({ row, col: c }) => (
        !this.isInBox(row, c, boxRow, boxCol) &&
        grid.cells[row][c].value === null &&
        this.getPossibleValues(grid, row, c).includes(value)
      ));

      if (affectedCells.length > 0) {
        return {
          type: 'pointing',
          message: `Dans la boîte ${boxRow + 1}-${boxCol + 1}, le chiffre ${value} est forcément sur la colonne ${col + 1}. Il peut donc être éliminé des autres cellules de cette colonne hors de la boîte.`,
          cells: [...possibleCells, ...affectedCells],
          value,
          eliminatedValues: [value],
          technique: 'Paire/Triple pointante'
        };
      }
    }

    return null;
  }

  private static findBasicElimination(grid: SudokuGrid): Hint | null {
    let bestHint: Hint | null = null;
    let bestRemainingCandidates = 10;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = grid.cells[row][col];
        if (cell.value !== null) continue;

        const possibleValues = this.getPossibleValues(grid, row, col);
        const eliminatedValues = this.digits().filter(value => !possibleValues.includes(value));

        if (eliminatedValues.length > 0 && possibleValues.length > 1 && possibleValues.length < bestRemainingCandidates) {
          bestRemainingCandidates = possibleValues.length;
          bestHint = {
            type: 'eliminate',
            message: `Pour L${row + 1}C${col + 1}, les chiffres ${eliminatedValues.join(', ')} sont impossibles, car ils apparaissent déjà dans la ligne, la colonne ou la boîte. Les candidats restants sont : ${possibleValues.join(', ')}.`,
            cells: [{ row, col }],
            eliminatedValues,
            technique: 'Élimination de base'
          };
        }
      }
    }

    return bestHint;
  }

  private static getPossibleValues(grid: SudokuGrid, row: number, col: number): number[] {
    if (grid.cells[row][col].value !== null) return [];

    const used = new Set<number>();

    for (let c = 0; c < 9; c++) {
      const value = grid.cells[row][c].value;
      if (value !== null) used.add(value);
    }

    for (let r = 0; r < 9; r++) {
      const value = grid.cells[r][col].value;
      if (value !== null) used.add(value);
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        const value = grid.cells[r][c].value;
        if (value !== null) used.add(value);
      }
    }

    return this.digits().filter(value => !used.has(value));
  }

  private static getUnitCells(unitType: UnitType, index: number): Position[] {
    if (unitType === 'row') return this.getRowCells(index);
    if (unitType === 'col') return this.getColumnCells(index);

    const boxRow = Math.floor(index / 3);
    const boxCol = index % 3;
    const cells: Position[] = [];
    for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
      for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
        cells.push({ row, col });
      }
    }

    return cells;
  }

  private static getRowCells(row: number): Position[] {
    return Array.from({ length: 9 }, (_, col) => ({ row, col }));
  }

  private static getColumnCells(col: number): Position[] {
    return Array.from({ length: 9 }, (_, row) => ({ row, col }));
  }

  private static getUnitName(unitType: UnitType, index: number): string {
    if (unitType === 'row') return `la ligne ${index + 1}`;
    if (unitType === 'col') return `la colonne ${index + 1}`;
    return `la boîte ${Math.floor(index / 3) + 1}-${(index % 3) + 1}`;
  }

  private static isInBox(row: number, col: number, boxRow: number, boxCol: number): boolean {
    return row >= boxRow * 3 && row < boxRow * 3 + 3 && col >= boxCol * 3 && col < boxCol * 3 + 3;
  }

  private static sameValues(first: readonly number[], second: readonly number[]): boolean {
    return first.length === second.length && first.every((value, index) => value === second[index]);
  }

  private static digits(): number[] {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }
}
