import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { cloneGrid as cloneSudokuGrid, sortDigits } from '@/features/sudoku/model/gridFactory';
import { getConflictKeys } from '@/features/sudoku/model/sudokuValidator';
import type { Cell, Digit, NotationMode, Position, SudokuGrid } from '@/features/sudoku/model/types';
import useGameTimer from './useGameTimer';
import { downloadJson, parseSavedGame, pickJsonFile, type SavedGame } from '@/features/sudoku/services/fileManager';

import type { Difficulty } from '@/features/sudoku/ui/panels/DifficultySelector';
import { createUniquePuzzleGrid } from '@/features/sudoku/model/sudokuGenerator';

import { clearScores, type LeaderboardEntry } from '@/features/sudoku/services/leaderboardLocal';
import { addScore, getTopScores } from '@/features/sudoku/services/leaderboardService';
import { getLastPlayerName, setLastPlayerName } from '@/features/sudoku/services/playerPrefs';

type GridHistoryState = {
  grid: SudokuGrid;
  past: SudokuGrid[];
  future: SudokuGrid[];
};

type GridAction =
  | { type: 'APPLY'; next: SudokuGrid }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET'; next: SudokuGrid };

function gridReducer(state: GridHistoryState, action: GridAction): GridHistoryState {
  switch (action.type) {
    case 'APPLY':
      return { grid: action.next, past: [...state.past, state.grid], future: [] };
    case 'UNDO': {
      if (state.past.length === 0) return state;
      const prev = state.past[state.past.length - 1];
      return { grid: prev, past: state.past.slice(0, -1), future: [state.grid, ...state.future] };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return { grid: next, past: [...state.past, state.grid], future: state.future.slice(1) };
    }
    case 'RESET':
      return { grid: action.next, past: [], future: [] };
    default:
      return state;
  }
}

type UseSudokuGameReturn = {
  grid: SudokuGrid;
  selected: Position | null;
  conflicts: Set<string>;

  mode: NotationMode;
  setMode: (m: NotationMode) => void;

  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;

  givensCount: number;

  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

  newGame: () => void;    // restart same puzzle
  newPuzzle: () => void;  // generate new puzzle

  timerSeconds: number;
  timerRunning: boolean;
  pauseTimer: () => void;
  startTimer: () => void;
  resetTimer: () => void;

  selectCell: (cell: Cell) => void;
  inputDigit: (digit: Digit) => void;
  clearActive: () => void;

  saveGame: () => void;
  loadGame: () => Promise<void>;

  isCompleted: boolean;
  isGameOver: boolean;
  closeCompleted: () => void;
  closeGameOver: () => void;

  isPlayerNameOpen: boolean;
  closePlayerName: () => void;
  submitPlayerName: (name: string) => Promise<void>;
  defaultPlayerName: string;

  isLeaderboardOpen: boolean;
  leaderboard: LeaderboardEntry[];
  openLeaderboard: () => void;
  closeLeaderboard: () => void;
  clearLeaderboard: () => void;

  lastSavedName: string | null;
};

function toggleDigit(list: Digit[], digit: Digit): Digit[] {
  const exists = list.includes(digit);
  const next = exists ? list.filter((d) => d !== digit) : [...list, digit];
  return sortDigits(next);
}

function isGridFull(grid: SudokuGrid) {
  for (const row of grid) for (const cell of row) if (cell.value === null) return false;
  return true;
}

export default function useSudokuGame(): UseSudokuGameReturn {
  const [difficultyState, setDifficultyState] = useState<Difficulty>('easy');

  const initialPack = useMemo(() => createUniquePuzzleGrid('easy'), []);
  const [puzzleSeed, setPuzzleSeed] = useState<SudokuGrid>(initialPack.grid);
  const [givensCount, setGivensCount] = useState<number>(initialPack.givens);

  const [history, dispatch] = useReducer(gridReducer, { grid: initialPack.grid, past: [], future: [] });

  const [selected, setSelected] = useState<Position | null>(null);
  const [mode, setMode] = useState<NotationMode>('value');

  const [isCompleted, setIsCompleted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [isPlayerNameOpen, setIsPlayerNameOpen] = useState(false);
  const [lastSavedName, setLastSavedName] = useState<string | null>(null);
  const [defaultPlayerName, setDefaultPlayerName] = useState(() => getLastPlayerName());

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const conflicts = useMemo(() => getConflictKeys(history.grid), [history.grid]);
  const timer = useGameTimer();

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  const refreshLeaderboard = useCallback(async () => {
    const rows = await getTopScores(10);
    setLeaderboard(rows);
  }, []);

  const resetRunState = useCallback(() => {
    setSelected(null);
    setMode('value');
    setIsCompleted(false);
    setIsGameOver(false);
    setIsPlayerNameOpen(false);
    setLastSavedName(null);
    timer.reset();
    timer.start();
  }, [timer]);

  const newPuzzle = useCallback(() => {
    const pack = createUniquePuzzleGrid(difficultyState);
    setPuzzleSeed(pack.grid);
    setGivensCount(pack.givens);
    dispatch({ type: 'RESET', next: pack.grid });
    resetRunState();
  }, [difficultyState, resetRunState]);

  // Restart same puzzle seed
  const newGame = useCallback(() => {
    dispatch({ type: 'RESET', next: puzzleSeed });
    resetRunState();
  }, [puzzleSeed, resetRunState]);

  const setDifficulty = useCallback(
    (d: Difficulty) => {
      setDifficultyState(d);
      const pack = createUniquePuzzleGrid(d);
      setPuzzleSeed(pack.grid);
      setGivensCount(pack.givens);
      dispatch({ type: 'RESET', next: pack.grid });
      resetRunState();
    },
    [resetRunState]
  );

  const selectCell = useCallback((cell: Cell) => setSelected({ row: cell.row, col: cell.col }), []);

  const inputDigit = useCallback(
    (digit: Digit) => {
      if (!selected) return;

      const current = history.grid[selected.row][selected.col];
      if (current.given) return;

      const next = cloneSudokuGrid(history.grid);
      const cell = next[selected.row][selected.col];

      if (mode === 'value') {
        next[selected.row][selected.col] = { ...cell, value: digit, cornerNotes: [], centerNotes: [] };
        dispatch({ type: 'APPLY', next });
        return;
      }

      if (cell.value !== null) return;

      if (mode === 'corner') {
        next[selected.row][selected.col] = { ...cell, cornerNotes: toggleDigit(cell.cornerNotes, digit) };
        dispatch({ type: 'APPLY', next });
        return;
      }

      next[selected.row][selected.col] = { ...cell, centerNotes: toggleDigit(cell.centerNotes, digit) };
      dispatch({ type: 'APPLY', next });
    },
    [history.grid, selected, mode]
  );

  const clearActive = useCallback(() => {
    if (!selected) return;

    const current = history.grid[selected.row][selected.col];
    if (current.given) return;

    const next = cloneSudokuGrid(history.grid);
    const cell = next[selected.row][selected.col];

    if (mode === 'value') {
      next[selected.row][selected.col] = { ...cell, value: null };
      dispatch({ type: 'APPLY', next });
      return;
    }
    if (mode === 'corner') {
      next[selected.row][selected.col] = { ...cell, cornerNotes: [] };
      dispatch({ type: 'APPLY', next });
      return;
    }

    next[selected.row][selected.col] = { ...cell, centerNotes: [] };
    dispatch({ type: 'APPLY', next });
  }, [history.grid, selected, mode]);

  // Save/Load JSON
  const saveGame = useCallback(() => {
    const payload: SavedGame = {
      version: 1,
      savedAt: new Date().toISOString(),
      grid: history.grid,
      mode,
      timerSeconds: timer.seconds,
    };
    downloadJson(`sudoku-save-${Date.now()}.json`, payload);
  }, [history.grid, mode, timer.seconds]);

  const loadGame = useCallback(async () => {
    const raw = await pickJsonFile();
    if (!raw) return;

    const parsed = parseSavedGame(raw);
    dispatch({ type: 'RESET', next: parsed.grid });
    setMode(parsed.mode);
    setSelected(null);
    setIsCompleted(false);
    setIsGameOver(false);
    setLastSavedName(null);

    timer.pause();
    timer.reset();
    timer.start();
  }, [timer]);

  // Completion / GameOver detection
  useEffect(() => {
    if (isCompleted || isGameOver) return;

    const full = isGridFull(history.grid);
    const hasConflicts = conflicts.size > 0;

    if (full && !hasConflicts) {
      setIsCompleted(true);
      timer.pause();
      setIsPlayerNameOpen(true);
      return;
    }

    const approxErrors = Math.floor(conflicts.size / 2);
    if (approxErrors >= 10) {
      setIsGameOver(true);
      timer.pause();
    }
  }, [history.grid, conflicts, isCompleted, isGameOver, timer]);

  const closeCompleted = () => setIsCompleted(false);
  const closeGameOver = () => setIsGameOver(false);

  // Player name / save score
  const closePlayerName = () => setIsPlayerNameOpen(false);

  const submitPlayerName = async (name: string) => {
    await addScore({ name, seconds: timer.seconds, difficulty: difficultyState });
    setLastSavedName(name);

    setLastPlayerName(name);
    setDefaultPlayerName(name);

    setIsPlayerNameOpen(false);
    await refreshLeaderboard();
  };

  // Leaderboard modal
  const openLeaderboard = () => {
    void refreshLeaderboard();
    setIsLeaderboardOpen(true);
  };
  const closeLeaderboard = () => setIsLeaderboardOpen(false);
  const clearLeaderboard = () => {
    clearScores();
    void refreshLeaderboard();
  };

  // Keyboard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (!selected) return;

      if (e.key >= '1' && e.key <= '9') {
        inputDigit(Number(e.key) as Digit);
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        clearActive();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, inputDigit, clearActive, undo, redo]);

  return {
    grid: history.grid,
    selected,
    conflicts,

    mode,
    setMode,

    difficulty: difficultyState,
    setDifficulty,

    givensCount,

    canUndo,
    canRedo,
    undo,
    redo,

    newGame,
    newPuzzle,

    timerSeconds: timer.seconds,
    timerRunning: timer.isRunning,
    pauseTimer: timer.pause,
    startTimer: timer.start,
    resetTimer: timer.reset,

    selectCell,
    inputDigit,
    clearActive,

    saveGame,
    loadGame,

    isCompleted,
    isGameOver,
    closeCompleted,
    closeGameOver,

    isPlayerNameOpen,
    closePlayerName,
    submitPlayerName,
    defaultPlayerName,

    isLeaderboardOpen,
    leaderboard,
    openLeaderboard,
    closeLeaderboard,
    clearLeaderboard,

    lastSavedName,
  };
}