import { useState, useCallback, useEffect } from 'react';
import { Command, GridState, NotationMode, CellColor } from '@/features/sudoku/model/types';
import { GridFactory } from '@/features/sudoku/model/gridFactory';
import { SudokuValidator } from '@/features/sudoku/model/sudokuValidator';
import { CommandManager } from '@/features/sudoku/services/commandManager';
import { FileManager } from '@/features/sudoku/services/fileManager';
import { useGameTimer } from './useGameTimer';
import { HintSystem, Hint } from '@/features/sudoku/model/hintSystem';
import { LeaderboardService } from '@/features/sudoku/services/leaderboardService';
import { LocalGameStorage } from '@/features/sudoku/services/localGameStorage';
import { PlayerStatsStorage } from '@/features/sudoku/services/playerStatsStorage';
import { testSupabaseConnection } from '@/shared/api/supabaseClient';
import { 
  SetValueCommand, 
  SetCornerNotesCommand, 
  SetCenterNotesCommand, 
  SetColorCommand,
  SetGridStateCommand 
} from '@/features/sudoku/model/commands/sudokuCommands';

export const useSudokuGame = () => {
  const [initialLocalSave] = useState(() => LocalGameStorage.load());
  const [gridState, setGridState] = useState<GridState>(() => {
    if (initialLocalSave) {
      return {
        ...initialLocalSave.gridState,
        selectedCells: [],
        errors: []
      };
    }

    const { grid, solution } = GridFactory.generateSamplePuzzleWithSolution();
    return {
      grid,
      solution,
      selectedCells: [],
      errors: []
    };
  });
  
  const [notationMode, setNotationMode] = useState<NotationMode>(initialLocalSave?.notationMode ?? 'value');
  const [currentDifficulty, setCurrentDifficulty] = useState<string>(initialLocalSave?.currentDifficulty ?? 'moyen');
  const [commandManager] = useState(() => new CommandManager());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [errorCount, setErrorCount] = useState(initialLocalSave?.errorCount ?? 0);
  const [currentHint, setCurrentHint] = useState<Hint | null>(null);
  const [hintsUsed, setHintsUsed] = useState(initialLocalSave?.hintsUsed ?? 0);
  const [availableHintTypes, setAvailableHintTypes] = useState<string[]>([]);
  const [showPlayerNameModal, setShowPlayerNameModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const maxErrors = getMaxErrorsForDifficulty(currentDifficulty);
  const maxHints = getMaxHintsForDifficulty(currentDifficulty);
  const { seconds, isRunning, startTimer, stopTimer, resetTimer, pauseTimer, setTimerSeconds } = useGameTimer(initialLocalSave?.seconds ?? 0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasLocalSave, setHasLocalSave] = useState(Boolean(initialLocalSave));
  const [lastLocalSaveAt, setLastLocalSaveAt] = useState<number | null>(initialLocalSave?.savedAt ?? null);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);

  // Test de connexion Supabase au démarrage
  useEffect(() => {
    const testConnection = async () => {
      const isConnected = await testSupabaseConnection();
      if (isConnected) {
        console.log('🎉 Tableau d\'honneur prêt !');
      } else {
        console.warn('⚠️ Tableau d\'honneur non disponible - vérifiez la configuration Supabase');
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    if (!isAutoSaveEnabled || isGameComplete || isGameOver || showPlayerNameModal) return;

    LocalGameStorage.save({
      gridState: {
        ...gridState,
        selectedCells: [],
        errors: []
      },
      currentDifficulty,
      notationMode,
      errorCount,
      hintsUsed,
      seconds
    });

    setHasLocalSave(true);
    setLastLocalSaveAt(Date.now());
  }, [gridState, currentDifficulty, notationMode, errorCount, hintsUsed, seconds, isAutoSaveEnabled, isGameComplete, isGameOver, showPlayerNameModal]);

  function getMaxErrorsForDifficulty(difficulty: string): number {
    switch (difficulty) {
      case 'facile': return 10;
      case 'moyen': return 8;
      case 'difficile': return 6;
      case 'expert': return 4;
      default: return 8;
    }
  }

  function getMaxHintsForDifficulty(difficulty: string): number {
    switch (difficulty) {
      case 'facile': return 8;
      case 'moyen': return 6;
      case 'difficile': return 4;
      case 'expert': return 2;
      default: return 6;
    }
  }

  // Update validation errors whenever grid changes
  useEffect(() => {
    const errors = SudokuValidator.validateGridWithSolution(gridState.grid, gridState.solution);
    const availableTypes = errors.length > 0 ? [] : HintSystem.getAvailableHintTypes(gridState.grid);

    // Avoid re-render loops: only update state if values really changed.
    // (Useful in dev/StrictMode and also protects against unstable deps.)
    const sameErrors = (
      a: readonly { row: number; col: number }[],
      b: readonly { row: number; col: number }[]
    ) => {
      if (a === b) return true;
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i].row !== b[i].row || a[i].col !== b[i].col) return false;
      }
      return true;
    };

    const sameHintTypes = (a: readonly string[], b: readonly string[]) => {
      if (a === b) return true;
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    };

    setGridState(prev => {
      if (sameErrors(prev.errors, errors)) return prev;
      return { ...prev, errors };
    });

    setAvailableHintTypes(prev => (sameHintTypes(prev, availableTypes) ? prev : availableTypes));

    // Check for game over (too many errors)
    if (errorCount >= maxErrors && !isGameOver && !isGameComplete) {
      stopTimer();
      setIsPaused(false);
      setIsGameOver(true);
      return;
    }
  }, [gridState.grid, gridState.solution, errorCount, maxErrors, isGameOver, isGameComplete, stopTimer]);

  // Separate effect for game completion to avoid double triggers
  useEffect(() => {
    const isComplete = SudokuValidator.isGridSolved(gridState.grid, gridState.solution);
    
    if (isComplete && !isGameComplete && !showPlayerNameModal && !isGameOver) {
      stopTimer();
      setIsPaused(false);
      setShowPlayerNameModal(true);
    }
  }, [gridState.grid, gridState.solution, isGameComplete, showPlayerNameModal, isGameOver, stopTimer]);

  // Update undo/redo availability
  useEffect(() => {
    setCanUndo(commandManager.canUndo());
    setCanRedo(commandManager.canRedo());
  }, [gridState, commandManager]);

  const getEditableSelectedCells = useCallback(() => (
    gridState.selectedCells.filter(({ row, col }) => !gridState.grid.cells[row][col].isGiven)
  ), [gridState]);

  const executeCommand = useCallback((command: Command) => {
    if (isPaused) return;

    // Start timer on first move
    if (!isRunning && !isGameComplete && !isGameOver) {
      startTimer();
    }

    const newState = commandManager.executeCommand(command);
    setGridState(newState);
  }, [commandManager, isRunning, isGameComplete, isGameOver, isPaused, startTimer]);

  const handleCellClick = useCallback((row: number, col: number, isMultiSelect = false) => {
    if (isPaused) return;

    // Start timer on first interaction
    if (!isRunning && !isGameComplete && !isGameOver) {
      startTimer();
    }

    setGridState(prev => {
      const isAlreadySelected = prev.selectedCells.some(
        cell => cell.row === row && cell.col === col
      );

      if (isAlreadySelected) {
        // Remove from selection
        return {
          ...prev,
          selectedCells: prev.selectedCells.filter(
            cell => !(cell.row === row && cell.col === col)
          )
        };
      } else {
        if (isMultiSelect) {
          // Add to existing selection
          return {
            ...prev,
            selectedCells: [...prev.selectedCells, { row, col }]
          };
        } else {
          // Replace selection with single cell
          return {
            ...prev,
            selectedCells: [{ row, col }]
          };
        }
      }
    });
  }, [isRunning, isGameComplete, isGameOver, isPaused, startTimer]);

  const handleCellDoubleClick = useCallback((row: number, col: number) => {
    if (isPaused) return;

    // Start timer on first interaction
    if (!isRunning && !isGameComplete && !isGameOver) {
      startTimer();
    }

    setGridState(prev => ({
      ...prev,
      selectedCells: [{ row, col }]
    }));
  }, [isRunning, isGameComplete, isGameOver, isPaused, startTimer]);

  const isIncorrectValue = useCallback((row: number, col: number, value: number): boolean => {
    if (gridState.solution) {
      return gridState.solution[row][col] !== value;
    }

    // Fallback for old imported saves without solution.
    for (let c = 0; c < 9; c++) {
      if (c !== col && gridState.grid.cells[row][c].value === value) {
        return true;
      }
    }

    for (let r = 0; r < 9; r++) {
      if (r !== row && gridState.grid.cells[r][col].value === value) {
        return true;
      }
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && gridState.grid.cells[r][c].value === value) {
          return true;
        }
      }
    }

    return false;
  }, [gridState]);

  const handleNumberClick = useCallback((number: number) => {
    const editableSelectedCells = getEditableSelectedCells();
    if (editableSelectedCells.length === 0 || isGameOver || isPaused) return;

    switch (notationMode) {
      case 'value': {
        // Count errors for each selected cell individually
        let errorCount = 0;
        editableSelectedCells.forEach(({ row, col }) => {
          if (isIncorrectValue(row, col, number)) {
            errorCount++;
          }
        });
        
        // Increment error count by the number of cells with errors
        if (errorCount > 0) {
          setErrorCount(prev => prev + errorCount);
        }
        
        executeCommand(new SetValueCommand(gridState, editableSelectedCells, number));
        break;
      }
      
      case 'corner': {
        // Toggle corner notes cell by cell in one atomic command.
        let nextGrid = gridState.grid;

        editableSelectedCells.forEach(({ row, col }) => {
          const cell = nextGrid.cells[row][col];
          const currentNotes = [...cell.cornerNotes];
          const noteIndex = currentNotes.indexOf(number);
          
          if (noteIndex >= 0) {
            currentNotes.splice(noteIndex, 1);
          } else if (currentNotes.length < 4) {
            currentNotes.push(number);
            currentNotes.sort();
          }
          
          nextGrid = GridFactory.updateGrid(nextGrid, row, col, { cornerNotes: currentNotes });
        });

        executeCommand(new SetGridStateCommand(gridState, { ...gridState, grid: nextGrid }));
        break;
      }
      
      case 'center': {
        // Toggle center notes cell by cell in one atomic command.
        let nextGrid = gridState.grid;

        editableSelectedCells.forEach(({ row, col }) => {
          const cell = nextGrid.cells[row][col];
          const currentNotes = [...cell.centerNotes];
          const noteIndex = currentNotes.indexOf(number);
          
          if (noteIndex >= 0) {
            currentNotes.splice(noteIndex, 1);
          } else {
            currentNotes.push(number);
            currentNotes.sort();
          }
          
          nextGrid = GridFactory.updateGrid(nextGrid, row, col, { centerNotes: currentNotes });
        });

        executeCommand(new SetGridStateCommand(gridState, { ...gridState, grid: nextGrid }));
        break;
      }
    }
  }, [gridState, notationMode, executeCommand, isGameOver, isPaused, getEditableSelectedCells, isIncorrectValue]);

  const handleClear = useCallback(() => {
    const editableSelectedCells = getEditableSelectedCells();
    if (editableSelectedCells.length === 0 || isGameOver || isPaused) return;

    switch (notationMode) {
      case 'value':
        executeCommand(new SetValueCommand(gridState, editableSelectedCells, null));
        break;
      
      case 'corner':
        executeCommand(new SetCornerNotesCommand(gridState, editableSelectedCells, []));
        break;
      
      case 'center':
        executeCommand(new SetCenterNotesCommand(gridState, editableSelectedCells, []));
        break;
      
      case 'color':
        executeCommand(new SetColorCommand(gridState, editableSelectedCells, null));
        break;
    }
  }, [gridState, notationMode, isGameOver, isPaused, executeCommand, getEditableSelectedCells]);


  const handleMoveSelection = useCallback((deltaRow: number, deltaCol: number, extendSelection = false) => {
    if (isPaused) return;

    setGridState(prev => {
      const currentCell = prev.selectedCells.length > 0
        ? prev.selectedCells[prev.selectedCells.length - 1]
        : { row: 0, col: 0 };
      const nextCell = {
        row: Math.min(8, Math.max(0, currentCell.row + deltaRow)),
        col: Math.min(8, Math.max(0, currentCell.col + deltaCol))
      };

      if (extendSelection) {
        const alreadySelected = prev.selectedCells.some(
          cell => cell.row === nextCell.row && cell.col === nextCell.col
        );

        return {
          ...prev,
          selectedCells: alreadySelected
            ? prev.selectedCells
            : [...prev.selectedCells, nextCell]
        };
      }

      return {
        ...prev,
        selectedCells: [nextCell]
      };
    });
  }, [isPaused]);

  // Gestion des événements clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorer si on est dans un modal ou un input
      if (showPlayerNameModal || showLeaderboard || showStatsModal || isGameOver || isPaused || 
          event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const handledKeys = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'Delete', 'Backspace', 'Escape',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
      ];

      if (handledKeys.includes(event.key)) {
        event.preventDefault();
      }

      if (event.key >= '1' && event.key <= '9') {
        handleNumberClick(Number(event.key));
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        handleClear();
        return;
      }

      if (event.key === 'Escape') {
        setGridState(prev => ({
          ...prev,
          selectedCells: []
        }));
        return;
      }

      const extendSelection = event.shiftKey;

      if (event.key === 'ArrowUp') {
        handleMoveSelection(-1, 0, extendSelection);
      } else if (event.key === 'ArrowDown') {
        handleMoveSelection(1, 0, extendSelection);
      } else if (event.key === 'ArrowLeft') {
        handleMoveSelection(0, -1, extendSelection);
      } else if (event.key === 'ArrowRight') {
        handleMoveSelection(0, 1, extendSelection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberClick, handleClear, handleMoveSelection, showPlayerNameModal, showLeaderboard, showStatsModal, isGameOver, isPaused]);

  const handleColorClick = useCallback((color: CellColor) => {
    const editableSelectedCells = getEditableSelectedCells();
    if (editableSelectedCells.length === 0 || isGameOver || isPaused) return;
    executeCommand(new SetColorCommand(gridState, editableSelectedCells, color));
  }, [gridState, isGameOver, isPaused, executeCommand, getEditableSelectedCells]);

  const handleUndo = useCallback(() => {
    const newState = commandManager.undo();
    if (newState) {
      setGridState(newState);
    }
  }, [commandManager]);

  const handleRedo = useCallback(() => {
    const newState = commandManager.redo();
    if (newState) {
      setGridState(newState);
    }
  }, [commandManager]);

  const handleSave = useCallback(() => {
    try {
      const saveData = FileManager.saveGrid(gridState.grid, gridState.solution);
      const filename = `sudoku-${new Date().toISOString().split('T')[0]}.json`;
      FileManager.downloadFile(saveData, filename);
    } catch (error) {
      alert(`Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }, [gridState.grid, gridState.solution]);

  const handleLoad = useCallback(async () => {
    try {
      const fileContent = await FileManager.uploadFile();
      const loadedGame = FileManager.loadGame(fileContent);
      
      setGridState({
        grid: loadedGame.grid,
        solution: loadedGame.solution,
        selectedCells: [],
        errors: []
      });
      
      commandManager.clear();
      setIsPaused(false);
      setIsAutoSaveEnabled(true);
      resetTimer();
    } catch (error) {
      alert(`Erreur lors du chargement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }, [commandManager, resetTimer]);

  const handleRestoreLocalSave = useCallback(() => {
    const savedGame = LocalGameStorage.load();
    if (!savedGame) {
      setHasLocalSave(false);
      setLastLocalSaveAt(null);
      return;
    }

    setGridState({
      ...savedGame.gridState,
      selectedCells: [],
      errors: []
    });
    setCurrentDifficulty(savedGame.currentDifficulty);
    setNotationMode(savedGame.notationMode);
    setErrorCount(savedGame.errorCount);
    setHintsUsed(savedGame.hintsUsed);
    setCurrentHint(null);
    setIsGameComplete(false);
    setIsGameOver(false);
    setIsPaused(false);
    setIsAutoSaveEnabled(true);
    setTimerSeconds(savedGame.seconds);
    commandManager.clear();
    pauseTimer();
    setHasLocalSave(true);
    setLastLocalSaveAt(savedGame.savedAt);
  }, [commandManager, pauseTimer, setTimerSeconds]);

  const handleClearLocalSave = useCallback(() => {
    LocalGameStorage.clear();
    setHasLocalSave(false);
    setLastLocalSaveAt(null);
    setIsAutoSaveEnabled(false);
  }, []);

  const handleNewGame = useCallback(() => {
    const { grid, solution } = GridFactory.generatePuzzleWithSolution(currentDifficulty);
    setGridState({
      grid,
      solution,
      selectedCells: [],
      errors: []
    });
    commandManager.clear();
    setIsGameComplete(false);
    setIsGameOver(false);
    setErrorCount(0);
    setCurrentHint(null);
    setHintsUsed(0);
    setIsPaused(false);
    setIsAutoSaveEnabled(true);
    resetTimer();
  }, [commandManager, currentDifficulty, resetTimer]);

  const handleNewPuzzle = useCallback((difficulty: string) => {
    const { grid, solution } = GridFactory.generatePuzzleWithSolution(difficulty);
    setGridState({
      grid,
      solution,
      selectedCells: [],
      errors: []
    });
    commandManager.clear();
    setIsGameComplete(false);
    setIsGameOver(false);
    setErrorCount(0);
    setCurrentHint(null);
    setHintsUsed(0);
    setIsPaused(false);
    setIsAutoSaveEnabled(true);
    resetTimer();
  }, [commandManager, resetTimer]);

  const handleDifficultyChange = useCallback((difficulty: string) => {
    setCurrentDifficulty(difficulty);
  }, []);

  const handleTogglePause = useCallback(() => {
    if (isGameComplete || isGameOver || showPlayerNameModal) return;

    if (isPaused) {
      setIsPaused(false);
      startTimer();
    } else {
      setIsPaused(true);
      pauseTimer();
    }
  }, [isGameComplete, isGameOver, showPlayerNameModal, isPaused, startTimer, pauseTimer]);



  useEffect(() => {
    const handlePauseShortcut = (event: KeyboardEvent) => {
      if (showPlayerNameModal || showLeaderboard || showStatsModal || isGameOver || isGameComplete ||
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (event.key.toLowerCase() === 'p') {
        event.preventDefault();
        handleTogglePause();
      }
    };

    window.addEventListener('keydown', handlePauseShortcut);
    return () => window.removeEventListener('keydown', handlePauseShortcut);
  }, [handleTogglePause, showPlayerNameModal, showLeaderboard, showStatsModal, isGameOver, isGameComplete]);

  const handleCloseCompletion = useCallback(() => {
    setIsGameComplete(false);
    setShowPlayerNameModal(false);
  }, []);

  const handleCloseGameOver = useCallback(() => {
    setIsGameOver(false);
  }, []);

  const handleGetHint = useCallback((hintType: string = 'auto') => {
    if (hintsUsed >= maxHints || isGameOver || isGameComplete || isPaused) return;

    const blockingErrors = SudokuValidator.validateGridWithSolution(gridState.grid, gridState.solution);
    if (blockingErrors.length > 0) {
      setCurrentHint({
        type: 'blocked',
        technique: 'Correction nécessaire',
        message: 'Les indices sont temporairement bloqués : corrigez d’abord les cellules en erreur. Sinon, l’aide pourrait vous guider à partir d’une grille incohérente.',
        cells: blockingErrors
      });
      setGridState(prev => ({
        ...prev,
        selectedCells: blockingErrors
      }));
      return;
    }
    
    const hint = HintSystem.generateSpecificHint(gridState.grid, hintType);
    if (hint) {
      setCurrentHint(hint);
      setHintsUsed(prev => prev + 1);
      
      // Highlight the cells mentioned in the hint
      setGridState(prev => ({
        ...prev,
        selectedCells: hint.cells
      }));
    } else if (hintType !== 'auto') {
      // If specific hint type not available, try auto
      const autoHint = HintSystem.generateHint(gridState.grid);
      if (autoHint) {
        setCurrentHint(autoHint);
        setHintsUsed(prev => prev + 1);
        setGridState(prev => ({
          ...prev,
          selectedCells: autoHint.cells
        }));
      }
    }
  }, [gridState.grid, gridState.solution, hintsUsed, maxHints, isGameOver, isGameComplete, isPaused]);

  const handleApplyHint = useCallback(() => {
    if (!currentHint || !currentHint.value || currentHint.cells.length !== 1 || isPaused) return;
    
    const { row, col } = currentHint.cells[0];
    executeCommand(new SetValueCommand(gridState, [{ row, col }], currentHint.value));
    setCurrentHint(null);
  }, [currentHint, gridState, executeCommand, isPaused]);

  const handleClearHint = useCallback(() => {
    setCurrentHint(null);
    setGridState(prev => ({
      ...prev,
      selectedCells: []
    }));
  }, []);

  const recordCompletedGame = useCallback(() => {
    PlayerStatsStorage.addCompletedGame({
      difficulty: currentDifficulty as 'facile' | 'moyen' | 'difficile' | 'expert',
      completionTime: seconds,
      errorCount,
      hintsUsed
    });
  }, [currentDifficulty, seconds, errorCount, hintsUsed]);

  const finalizeCompletedGame = useCallback(() => {
    LocalGameStorage.clear();
    setHasLocalSave(false);
    setLastLocalSaveAt(null);
    setShowPlayerNameModal(false);
    setIsGameComplete(true);
  }, []);

  const handleSaveScore = useCallback(async (playerName: string) => {
    await LeaderboardService.addScore({
      player_name: playerName,
      difficulty: currentDifficulty,
      completion_time: seconds,
      error_count: errorCount
    });

    recordCompletedGame();
    finalizeCompletedGame();
  }, [currentDifficulty, seconds, errorCount, recordCompletedGame, finalizeCompletedGame]);

  const handleSkipScore = useCallback(() => {
    recordCompletedGame();
    finalizeCompletedGame();
  }, [recordCompletedGame, finalizeCompletedGame]);

  const handleShowLeaderboard = useCallback(() => {
    setShowLeaderboard(true);
  }, []);

  const handleCloseLeaderboard = useCallback(() => {
    setShowLeaderboard(false);
  }, []);

  const handleShowStats = useCallback(() => {
    setShowStatsModal(true);
  }, []);

  const handleCloseStats = useCallback(() => {
    setShowStatsModal(false);
  }, []);

  return {
    gridState,
    notationMode,
    currentDifficulty,
    canUndo,
    canRedo,
    isGameComplete,
    isGameOver,
    errorCount,
    maxErrors,
    currentHint,
    hintsUsed,
    maxHints,
    availableHintTypes,
    showPlayerNameModal,
    showLeaderboard,
    showStatsModal,
    gameTime: seconds,
    isTimerRunning: isRunning,
    isPaused,
    hasLocalSave,
    lastLocalSaveAt,
    setNotationMode,
    handleDifficultyChange,
    handleCellClick,
    handleCellDoubleClick,
    handleMoveSelection,
    handleNumberClick,
    handleColorClick,
    handleClear,
    handleUndo,
    handleRedo,
    handleSave,
    handleLoad,
    handleRestoreLocalSave,
    handleClearLocalSave,
    handleNewGame,
    handleNewPuzzle,
    handleTogglePause,
    handleCloseCompletion,
    handleCloseGameOver,
    handleGetHint,
    handleApplyHint,
    handleClearHint,
    handleSaveScore,
    handleSkipScore,
    handleShowLeaderboard,
    handleCloseLeaderboard,
    handleShowStats,
    handleCloseStats
  };
};