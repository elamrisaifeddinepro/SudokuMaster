export interface DifficultyLevel {
  name: string;
  cellsToRemove: number;
  description: string;
}

export const DIFFICULTY_LEVELS: Record<string, DifficultyLevel> = {
  facile: {
    name: 'Facile',
    cellsToRemove: 35,
    description: '46 chiffres donnés'
  },
  moyen: {
    name: 'Moyen',
    cellsToRemove: 45,
    description: '36 chiffres donnés'
  },
  difficile: {
    name: 'Difficile',
    cellsToRemove: 55,
    description: '26 chiffres donnés'
  },
  expert: {
    name: 'Expert',
    cellsToRemove: 60,
    description: '21 chiffres donnés'
  }
};

type Position = readonly [row: number, col: number];

export class SudokuGenerator {
  private static readonly GRID_SIZE = 9;
  private static readonly BOX_SIZE = 3;
  private static readonly EMPTY = 0;
  private static readonly MAX_REMOVAL_PASSES = 3;

  private static cloneGrid(grid: number[][]): number[][] {
    return grid.map(row => [...row]);
  }

  private static isValid(grid: number[][], row: number, col: number, num: number): boolean {
    for (let x = 0; x < this.GRID_SIZE; x++) {
      if (grid[row][x] === num || grid[x][col] === num) {
        return false;
      }
    }

    const startRow = row - (row % this.BOX_SIZE);
    const startCol = col - (col % this.BOX_SIZE);

    for (let i = 0; i < this.BOX_SIZE; i++) {
      for (let j = 0; j < this.BOX_SIZE; j++) {
        if (grid[startRow + i][startCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  }

  private static getCandidates(grid: number[][], row: number, col: number): number[] {
    const candidates: number[] = [];

    for (let num = 1; num <= this.GRID_SIZE; num++) {
      if (this.isValid(grid, row, col, num)) {
        candidates.push(num);
      }
    }

    return candidates;
  }

  private static findBestEmptyCell(grid: number[][]): { row: number; col: number; candidates: number[] } | null {
    let bestCell: { row: number; col: number; candidates: number[] } | null = null;

    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (grid[row][col] !== this.EMPTY) {
          continue;
        }

        const candidates = this.getCandidates(grid, row, col);

        if (candidates.length === 0) {
          return { row, col, candidates };
        }

        if (!bestCell || candidates.length < bestCell.candidates.length) {
          bestCell = { row, col, candidates };
        }
      }
    }

    return bestCell;
  }

  private static solveSudoku(grid: number[][]): boolean {
    const cell = this.findBestEmptyCell(grid);

    if (!cell) {
      return true;
    }

    if (cell.candidates.length === 0) {
      return false;
    }

    for (const num of cell.candidates) {
      grid[cell.row][cell.col] = num;

      if (this.solveSudoku(grid)) {
        return true;
      }

      grid[cell.row][cell.col] = this.EMPTY;
    }

    return false;
  }

  private static countSolutions(grid: number[][], limit = 2): number {
    const cell = this.findBestEmptyCell(grid);

    if (!cell) {
      return 1;
    }

    if (cell.candidates.length === 0) {
      return 0;
    }

    let solutions = 0;

    for (const num of cell.candidates) {
      grid[cell.row][cell.col] = num;
      solutions += this.countSolutions(grid, limit - solutions);
      grid[cell.row][cell.col] = this.EMPTY;

      if (solutions >= limit) {
        return solutions;
      }
    }

    return solutions;
  }

  private static hasUniqueSolution(grid: number[][]): boolean {
    return this.countSolutions(this.cloneGrid(grid), 2) === 1;
  }

  private static generateCompleteGrid(): number[][] {
    const grid: number[][] = Array(this.GRID_SIZE)
      .fill(null)
      .map(() => Array(this.GRID_SIZE).fill(this.EMPTY));

    for (let box = 0; box < this.GRID_SIZE; box += this.BOX_SIZE) {
      this.fillBox(grid, box, box);
    }

    this.solveSudoku(grid);
    return grid;
  }

  private static fillBox(grid: number[][], row: number, col: number): void {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.shuffleArray(numbers);

    let index = 0;

    for (let i = 0; i < this.BOX_SIZE; i++) {
      for (let j = 0; j < this.BOX_SIZE; j++) {
        grid[row + i][col + j] = numbers[index++];
      }
    }
  }

  private static shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private static getShuffledPositions(): Position[] {
    const positions: Position[] = [];

    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        positions.push([row, col]);
      }
    }

    this.shuffleArray(positions);
    return positions;
  }

  private static removeNumbers(grid: number[][], cellsToRemove: number): number[][] {
    const puzzle = this.cloneGrid(grid);
    let removed = 0;
    let pass = 0;

    while (removed < cellsToRemove && pass < this.MAX_REMOVAL_PASSES) {
      const positions = this.getShuffledPositions();

      for (const [row, col] of positions) {
        if (removed >= cellsToRemove || puzzle[row][col] === this.EMPTY) {
          continue;
        }

        const previousValue = puzzle[row][col];
        puzzle[row][col] = this.EMPTY;

        if (this.hasUniqueSolution(puzzle)) {
          removed++;
        } else {
          puzzle[row][col] = previousValue;
        }
      }

      pass++;
    }

    return puzzle;
  }

  static generatePuzzle(difficulty: string = 'moyen'): { puzzle: number[][]; solution: number[][] } {
    const difficultyLevel = DIFFICULTY_LEVELS[difficulty] || DIFFICULTY_LEVELS.moyen;
    const solution = this.generateCompleteGrid();
    const puzzle = this.removeNumbers(solution, difficultyLevel.cellsToRemove);

    return {
      puzzle: this.cloneGrid(puzzle),
      solution: this.cloneGrid(solution)
    };
  }

  static generateSamplePuzzle(): { puzzle: number[][]; solution: number[][] } {
    const puzzle = [
      [5, 0, 0, 2, 0, 0, 0, 4, 0],
      [0, 0, 0, 6, 0, 3, 0, 0, 0],
      [0, 3, 0, 0, 0, 9, 0, 0, 7],
      [0, 0, 3, 0, 0, 7, 0, 0, 0],
      [0, 0, 7, 0, 0, 8, 0, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 2, 0],
      [0, 8, 0, 0, 0, 0, 0, 0, 3],
      [0, 0, 0, 4, 0, 0, 6, 0, 0],
      [0, 0, 0, 1, 0, 0, 5, 0, 0]
    ];

    const solution = this.cloneGrid(puzzle);
    this.solveSudoku(solution);

    return { puzzle, solution };
  }
}
