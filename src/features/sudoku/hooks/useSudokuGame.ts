import { useCallback, useEffect, useMemo, useState } from 'react';
import { cloneGrid, createMockGrid, sortDigits } from '@/features/sudoku/model/gridFactory';
import { getConflictKeys } from '@/features/sudoku/model/sudokuValidator';
import type { Cell, Digit, NotationMode, Position, SudokuGrid } from '@/features/sudoku/model/types';

type UseSudokuGameReturn = {
  grid: SudokuGrid;
  selected: Position | null;
  conflicts: Set<string>;

  mode: NotationMode;
  setMode: (m: NotationMode) => void;

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
  const initialGrid = useMemo(() => createMockGrid(), []);
  const [grid, setGrid] = useState<SudokuGrid>(initialGrid);
  const [selected, setSelected] = useState<Position | null>(null);
  const [mode, setMode] = useState<NotationMode>('value');

  const conflicts = useMemo(() => getConflictKeys(grid), [grid]);

  const selectCell = useCallback((cell: Cell) => {
    setSelected({ row: cell.row, col: cell.col });
  }, []);

  const inputDigit = useCallback(
    (digit: Digit) => {
      if (!selected) return;

      setGrid((prev) => {
        const current = prev[selected.row][selected.col];
        if (current.given) return prev;

        const next = cloneGrid(prev);
        const cell = next[selected.row][selected.col];

        if (mode === 'value') {
          next[selected.row][selected.col] = {
            ...cell,
            value: digit,
            cornerNotes: [],
            centerNotes: [],
          };
          return next;
        }

        // Si une valeur existe, on ne modifie pas les notes
        if (cell.value !== null) return prev;

        if (mode === 'corner') {
          next[selected.row][selected.col] = { ...cell, cornerNotes: toggleDigit(cell.cornerNotes, digit) };
          return next;
        }

        next[selected.row][selected.col] = { ...cell, centerNotes: toggleDigit(cell.centerNotes, digit) };
        return next;
      });
    },
    [selected, mode]
  );

  const clearActive = useCallback(() => {
    if (!selected) return;

    setGrid((prev) => {
      const current = prev[selected.row][selected.col];
      if (current.given) return prev;

      const next = cloneGrid(prev);
      const cell = next[selected.row][selected.col];

      if (mode === 'value') {
        next[selected.row][selected.col] = { ...cell, value: null };
        return next;
      }

      if (mode === 'corner') {
        next[selected.row][selected.col] = { ...cell, cornerNotes: [] };
        return next;
      }

      next[selected.row][selected.col] = { ...cell, centerNotes: [] };
      return next;
    });
  }, [selected, mode]);

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
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, inputDigit, clearActive]);

  return { grid, selected, conflicts, mode, setMode, selectCell, inputDigit, clearActive };
}