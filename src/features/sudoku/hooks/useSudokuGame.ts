import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { cloneGrid, createMockGrid, sortDigits } from '@/features/sudoku/model/gridFactory';
import { getConflictKeys } from '@/features/sudoku/model/sudokuValidator';
import type { Cell, Digit, NotationMode, Position, SudokuGrid } from '@/features/sudoku/model/types';
import useGameTimer from './useGameTimer';

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
    case 'APPLY': {
      return {
        grid: action.next,
        past: [...state.past, state.grid],
        future: [],
      };
    }
    case 'UNDO': {
      if (state.past.length === 0) return state;
      const prev = state.past[state.past.length - 1];
      return {
        grid: prev,
        past: state.past.slice(0, -1),
        future: [state.grid, ...state.future],
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        grid: next,
        past: [...state.past, state.grid],
        future: state.future.slice(1),
      };
    }
    case 'RESET': {
      return { grid: action.next, past: [], future: [] };
    }
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

  // History
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

  // New Game
  newGame: () => void;

  // Timer
  timerSeconds: number;
  timerRunning: boolean;
  pauseTimer: () => void;
  startTimer: () => void;
  resetTimer: () => void;

  // Input
  selectCell: (cell: Cell) => void;
  inputDigit: (digit: Digit) => void;
  clearActive: () => void;
};

function toggleDigit(list: Digit[], digit: Digit): Digit[] {
  const exists = list.includes(digit);
  const next = exists ? list.filter((d) => d !== digit) : [...list, digit];
  return sortDigits(next);
}

export default function useSudokuGame(): UseSudokuGameReturn {
  const initial = useMemo(() => createMockGrid(), []);

  const [history, dispatch] = useReducer(gridReducer, {
    grid: initial,
    past: [],
    future: [],
  });

  const [selected, setSelected] = useState<Position | null>(null);
  const [mode, setMode] = useState<NotationMode>('value');

  const conflicts = useMemo(() => getConflictKeys(history.grid), [history.grid]);

  // Timer
  const timer = useGameTimer();

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  const newGame = useCallback(() => {
    dispatch({ type: 'RESET', next: createMockGrid() });
    setSelected(null);
    setMode('value');
    timer.reset();
    timer.start();
  }, [timer]);

  const selectCell = useCallback((cell: Cell) => {
    setSelected({ row: cell.row, col: cell.col });
  }, []);

  const inputDigit = useCallback(
    (digit: Digit) => {
      if (!selected) return;

      const current = history.grid[selected.row][selected.col];
      if (current.given) return;

      const next = cloneGrid(history.grid);
      const cell = next[selected.row][selected.col];

      if (mode === 'value') {
        next[selected.row][selected.col] = {
          ...cell,
          value: digit,
          cornerNotes: [],
          centerNotes: [],
        };
        dispatch({ type: 'APPLY', next });
        return;
      }

      // si valeur existe, on ne change pas les notes
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

    const next = cloneGrid(history.grid);
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

  // Clavier
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

    canUndo,
    canRedo,
    undo,
    redo,

    newGame,

    timerSeconds: timer.seconds,
    timerRunning: timer.isRunning,
    pauseTimer: timer.pause,
    startTimer: timer.start,
    resetTimer: timer.reset,

    selectCell,
    inputDigit,
    clearActive,
  };
}