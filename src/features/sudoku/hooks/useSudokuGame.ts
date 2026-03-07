import { useState, useCallback, useEffect } from 'react';
import { GridState, NotationMode, CellColor } from '@/features/sudoku/model/types';
import { GridFactory } from '@/features/sudoku/model/gridFactory';
import { SudokuValidator } from '@/features/sudoku/model/sudokuValidator';
import { CommandManager } from '@/features/sudoku/services/commandManager';
import { FileManager } from '@/features/sudoku/services/fileManager';
import { useGameTimer } from './useGameTimer';
import { HintSystem, Hint } from '@/features/sudoku/model/hintSystem';
import { LeaderboardService } from '@/features/sudoku/services/leaderboardService';
import { testSupabaseConnection } from '@/shared/api/supabaseClient';
import { 
  SetValueCommand, 
  SetCornerNotesCommand, 
  SetCenterNotesCommand, 
  SetColorCommand 
} from '@/features/sudoku/model/commands/sudokuCommands';

export const useSudokuGame = () => {
  const [gridState, setGridState] = useState<GridState>(() => ({
    grid: GridFactory.generateSamplePuzzle(),
    selectedCells: [],
    errors: []
  }));
  
  const [notationMode, setNotationMode] = useState<NotationMode>('value');
  const [currentDifficulty, setCurrentDifficulty] = useState<string>('moyen');
  const [commandManager] = useState(() => new CommandManager());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [currentHint, setCurrentHint] = useState<Hint | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [availableHintTypes, setAvailableHintTypes] = useState<string[]>([]);
  const [showPlayerNameModal, setShowPlayerNameModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const maxErrors = getMaxErrorsForDifficulty(currentDifficulty);
  const maxHints = getMaxHintsForDifficulty(currentDifficulty);
  const { seconds, isRunning, startTimer, stopTimer, resetTimer, pauseTimer } = useGameTimer();

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
    const errors = SudokuValidator.validateGrid(gridState.grid);
    const availableTypes = HintSystem.getAvailableHintTypes(gridState.grid);

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
      setIsGameOver(true);
      return;
    }
  }, [gridState.grid, errorCount, maxErrors, isGameOver, isGameComplete, stopTimer]);

  // Separate effect for game completion to avoid double triggers
  useEffect(() => {
    const isComplete = SudokuValidator.isGridSolved(gridState.grid);
    
    if (isComplete && !isGameComplete && !showPlayerNameModal && !isGameOver) {
      stopTimer();
      setShowPlayerNameModal(true);
    }
  }, [gridState.grid, isGameComplete, showPlayerNameModal, isGameOver, stopTimer]);

  // Update undo/redo availability
  useEffect(() => {
    setCanUndo(commandManager.canUndo());
    setCanRedo(commandManager.canRedo());
  }, [gridState, commandManager]);

  const executeCommand = useCallback((command: any) => {
    // Start timer on first move
    if (!isRunning && !isGameComplete && !isGameOver) {
      startTimer();
    }

    const newState = commandManager.executeCommand(command);
    setGridState(newState);
  }, [commandManager, isRunning, isGameComplete, isGameOver, startTimer]);

  const handleCellClick = useCallback((row: number, col: number) => {
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
        // Check if Ctrl key is pressed for multi-selection
        const event = window.event as MouseEvent;
        const isCtrlPressed = event?.ctrlKey || event?.metaKey;
        
        if (isCtrlPressed) {
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
  }, [isRunning, isGameComplete, isGameOver, startTimer]);

  const handleCellDoubleClick = useCallback((row: number, col: number) => {
    // Start timer on first interaction
    if (!isRunning && !isGameComplete && !isGameOver) {
      startTimer();
    }

    setGridState(prev => ({
      ...prev,
      selectedCells: [{ row, col }]
    }));
  }, [isRunning, isGameComplete, isGameOver, startTimer]);

  const handleNumberClick = useCallback((number: number) => {
    if (gridState.selectedCells.length === 0 || isGameOver) return;

    switch (notationMode) {
      case 'value':
        // Count errors for each selected cell individually
        let errorCount = 0;
        gridState.selectedCells.forEach(({ row, col }) => {
          let hasError = false;
          
          // Check row conflicts
          for (let c = 0; c < 9; c++) {
            if (c !== col && gridState.grid.cells[row][c].value === number) {
              hasError = true;
              break;
            }
          }
          
          // Check column conflicts
          if (!hasError) {
            for (let r = 0; r < 9; r++) {
              if (r !== row && gridState.grid.cells[r][col].value === number) {
                hasError = true;
                break;
              }
            }
          }
          
          // Check 3x3 box conflicts
          if (!hasError) {
            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(col / 3) * 3;
            for (let r = boxRow; r < boxRow + 3; r++) {
              for (let c = boxCol; c < boxCol + 3; c++) {
                if ((r !== row || c !== col) && gridState.grid.cells[r][c].value === number) {
                  hasError = true;
                  break;
                }
              }
              if (hasError) break;
            }
          }
          
          if (hasError) {
            errorCount++;
          }
        });
        
        // Increment error count by the number of cells with errors
        if (errorCount > 0) {
          setErrorCount(prev => prev + errorCount);
        }
        
        executeCommand(new SetValueCommand(gridState, gridState.selectedCells, number));
        break;
      
      case 'corner':
        // Toggle corner note - max 4 notes
        gridState.selectedCells.forEach(({ row, col }) => {
          const cell = gridState.grid.cells[row][col];
          const currentNotes = [...cell.cornerNotes];
          const noteIndex = currentNotes.indexOf(number);
          
          if (noteIndex >= 0) {
            // Remove note if it exists
            currentNotes.splice(noteIndex, 1);
          } else if (currentNotes.length < 4) {
            // Add note if less than 4 notes
            currentNotes.push(number);
            currentNotes.sort();
          }
          
          executeCommand(new SetCornerNotesCommand(gridState, [{ row, col }], currentNotes));
        });
        break;
      
      case 'center':
        // Toggle center note
        gridState.selectedCells.forEach(({ row, col }) => {
          const cell = gridState.grid.cells[row][col];
          const currentNotes = [...cell.centerNotes];
          const noteIndex = currentNotes.indexOf(number);
          
          if (noteIndex >= 0) {
            // Remove note if it exists
            currentNotes.splice(noteIndex, 1);
          } else {
            // Add note
            currentNotes.push(number);
            currentNotes.sort();
          }
          
          executeCommand(new SetCenterNotesCommand(gridState, [{ row, col }], currentNotes));
        });
        break;
    }
  }, [gridState, notationMode, executeCommand, isGameOver]);

  const handleClear = useCallback(() => {
    if (gridState.selectedCells.length === 0 || isGameOver) return;

    switch (notationMode) {
      case 'value':
        executeCommand(new SetValueCommand(gridState, gridState.selectedCells, null));
        break;
      
      case 'corner':
        executeCommand(new SetCornerNotesCommand(gridState, gridState.selectedCells, []));
        break;
      
      case 'center':
        executeCommand(new SetCenterNotesCommand(gridState, gridState.selectedCells, []));
        break;
      
      case 'color':
        executeCommand(new SetColorCommand(gridState, gridState.selectedCells, null));
        break;
    }
  }, [gridState, notationMode, isGameOver]);

  // Gestion des événements clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorer si on est dans un modal ou un input
      if (showPlayerNameModal || showLeaderboard || isGameOver || 
          event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Empêcher le comportement par défaut pour nos touches
      if (['1','2','3','4','5','6','7','8','9','Delete','Backspace','Escape'].includes(event.key)) {
        event.preventDefault();
      }

      // Saisie des chiffres 1-9
      if (event.key >= '1' && event.key <= '9') {
        const number = parseInt(event.key);
        handleNumberClick(number);
      }
      
      // Effacer avec Delete ou Backspace
      else if (event.key === 'Delete' || event.key === 'Backspace') {
        handleClear();
      }
      
      // Désélectionner avec Escape
      else if (event.key === 'Escape') {
        setGridState(prev => ({
          ...prev,
          selectedCells: []
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberClick, handleClear, showPlayerNameModal, showLeaderboard, isGameOver]);

  const handleColorClick = useCallback((color: CellColor) => {
    if (gridState.selectedCells.length === 0 || isGameOver) return;
    executeCommand(new SetColorCommand(gridState, gridState.selectedCells, color));
  }, [gridState, isGameOver]);

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
      const saveData = FileManager.saveGrid(gridState.grid);
      const filename = `sudoku-${new Date().toISOString().split('T')[0]}.json`;
      FileManager.downloadFile(saveData, filename);
    } catch (error) {
      alert(`Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }, [gridState.grid]);

  const handleLoad = useCallback(async () => {
    try {
      const fileContent = await FileManager.uploadFile();
      const loadedGrid = FileManager.loadGrid(fileContent);
      
      setGridState({
        grid: loadedGrid,
        selectedCells: [],
        errors: []
      });
      
      commandManager.clear();
    } catch (error) {
      alert(`Erreur lors du chargement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }, [commandManager]);

  const handleNewGame = useCallback(() => {
    setGridState({
      grid: GridFactory.generatePuzzle(currentDifficulty),
      selectedCells: [],
      errors: []
    });
    commandManager.clear();
    setIsGameComplete(false);
    setIsGameOver(false);
    setErrorCount(0);
    setCurrentHint(null);
    setHintsUsed(0);
    resetTimer();
  }, [commandManager, currentDifficulty, resetTimer]);

  const handleNewPuzzle = useCallback((difficulty: string) => {
    setGridState({
      grid: GridFactory.generatePuzzle(difficulty),
      selectedCells: [],
      errors: []
    });
    commandManager.clear();
    setIsGameComplete(false);
    setIsGameOver(false);
    setErrorCount(0);
    setCurrentHint(null);
    setHintsUsed(0);
    resetTimer();
  }, [commandManager, resetTimer]);

  const handleDifficultyChange = useCallback((difficulty: string) => {
    setCurrentDifficulty(difficulty);
  }, []);

  const handleCloseCompletion = useCallback(() => {
    setIsGameComplete(false);
    setShowPlayerNameModal(false);
  }, []);

  const handleCloseGameOver = useCallback(() => {
    setIsGameOver(false);
  }, []);

  const handleGetHint = useCallback((hintType: string = 'auto') => {
    if (hintsUsed >= maxHints || isGameOver || isGameComplete) return;
    
    const hint = HintSystem.generateSpecificHint(gridState.grid, hintType);
    if (hint) {
      setCurrentHint(hint);
      setHintsUsed(prev => prev + 1);
      
      // Highlight the cells mentioned in the hint
      setGridState(prev => ({
        ...prev,
        selectedCells: hint.cells
      }));
    } else {
      // If specific hint type not available, try auto
      if (hintType !== 'auto') {
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
    }
  }, [gridState.grid, hintsUsed, maxHints, isGameOver, isGameComplete]);

  const handleApplyHint = useCallback(() => {
    if (!currentHint || !currentHint.value || currentHint.cells.length !== 1) return;
    
    const { row, col } = currentHint.cells[0];
    executeCommand(new SetValueCommand(gridState, [{ row, col }], currentHint.value));
    setCurrentHint(null);
  }, [currentHint, gridState, executeCommand]);

  const handleClearHint = useCallback(() => {
    setCurrentHint(null);
    setGridState(prev => ({
      ...prev,
      selectedCells: []
    }));
  }, []);

  const handleSaveScore = useCallback(async (playerName: string) => {
    try {
      console.log('Saving score with data:', {
        player_name: playerName,
        difficulty: currentDifficulty,
        completion_time: seconds,
        error_count: errorCount
      });
      
      await LeaderboardService.addScore({
        player_name: playerName,
        difficulty: currentDifficulty,
        completion_time: seconds,
        error_count: errorCount
      });
      
      console.log('Score save completed, closing modal');
      setShowPlayerNameModal(false);
      setIsGameComplete(true);
    } catch (error) {
      console.error('Error saving score:', error);
      // Still show completion modal even if save fails
      alert('Erreur lors de la sauvegarde du score. Veuillez réessayer.');
      setShowPlayerNameModal(false);
      setIsGameComplete(true);
    }
  }, [currentDifficulty, seconds, errorCount]);

  const handleSkipScore = useCallback(() => {
    setShowPlayerNameModal(false);
    setIsGameComplete(true);
  }, []);

  const handleShowLeaderboard = useCallback(() => {
    setShowLeaderboard(true);
  }, []);

  const handleCloseLeaderboard = useCallback(() => {
    setShowLeaderboard(false);
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
    gameTime: seconds,
    isTimerRunning: isRunning,
    setNotationMode,
    handleDifficultyChange,
    handleCellClick,
    handleCellDoubleClick,
    handleNumberClick,
    handleColorClick,
    handleClear,
    handleUndo,
    handleRedo,
    handleSave,
    handleLoad,
    handleNewGame,
    handleNewPuzzle,
    handleCloseCompletion,
    handleCloseGameOver,
    handleGetHint,
    handleApplyHint,
    handleClearHint,
    handleSaveScore,
    handleSkipScore,
    handleShowLeaderboard,
    handleCloseLeaderboard
  };
};