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
    cellsToRemove: 65,
    description: '16 chiffres donnés'
  }
};

export class SudokuGenerator {
  private static isValid(grid: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  }

  private static solveSudoku(grid: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (this.solveSudoku(grid)) {
                return true;
              }
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  private static generateCompleteGrid(): number[][] {
    const grid: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
    
    // Fill diagonal 3x3 boxes first (they don't affect each other)
    for (let box = 0; box < 9; box += 3) {
      this.fillBox(grid, box, box);
    }
    
    // Solve the rest
    this.solveSudoku(grid);
    return grid;
  }

  private static fillBox(grid: number[][], row: number, col: number): void {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.shuffleArray(numbers);
    
    let index = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
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

  private static removeNumbers(grid: number[][], cellsToRemove: number): number[][] {
    const puzzle = grid.map(row => [...row]);
    let removed = 0;
    
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }
    
    return puzzle;
  }

  static generatePuzzle(difficulty: string = 'moyen'): { puzzle: number[][], solution: number[][] } {
    const difficultyLevel = DIFFICULTY_LEVELS[difficulty] || DIFFICULTY_LEVELS.moyen;
    
    // Generate a complete valid Sudoku grid
    const solution = this.generateCompleteGrid();
    
    // Remove numbers based on difficulty
    const puzzle = this.removeNumbers(solution, difficultyLevel.cellsToRemove);
    
    return {
      puzzle: puzzle.map(row => [...row]),
      solution: solution.map(row => [...row])
    };
  }

  // Generate a specific puzzle similar to the image provided
  static generateSamplePuzzle(): { puzzle: number[][], solution: number[][] } {
    // This creates a puzzle similar to the one in the image
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

    // Generate solution by solving this puzzle
    const solution = puzzle.map(row => [...row]);
    this.solveSudoku(solution);

    return { puzzle, solution };
  }
}