import { useEffect, useMemo, useState } from 'react';
import { cloneGrid, createMockGrid } from '@/features/sudoku/model/gridFactory';
import type { Cell, Digit, Position, SudokuGrid } from '@/features/sudoku/model/types';

type UseSudokuGameReturn = {
  grid: SudokuGrid;
  selected: Position | null;
  selectCell: (cell: Cell) => void;
  setDigit: (digit: Digit) => void;
  clearCell: () => void;
};

function isEditableCell(grid: SudokuGrid, pos: Position | null) {
  if (!pos) return false;
  return !grid[pos.row][pos.col].given;
}

export default function useSudokuGame(): UseSudokuGameReturn {
  const initialGrid = useMemo(() => createMockGrid(), []);
  const [grid, setGrid] = useState<SudokuGrid>(initialGrid);
  const [selected, setSelected] = useState<Position | null>(null);

  const selectCell = (cell: Cell) => {
    setSelected({ row: cell.row, col: cell.col });
  };

  const setDigit = (digit: Digit) => {
    if (!selected) return;
    if (!isEditableCell(grid, selected)) return;

    setGrid((prev) => {
      const next = cloneGrid(prev);
      const current = next[selected.row][selected.col];
      next[selected.row][selected.col] = { ...current, value: digit };
      return next;
    });
  };

  const clearCell = () => {
    if (!selected) return;
    if (!isEditableCell(grid, selected)) return;

    setGrid((prev) => {
      const next = cloneGrid(prev);
      const current = next[selected.row][selected.col];
      next[selected.row][selected.col] = { ...current, value: null };
      return next;
    });
  };

  // Clavier: 1..9 pour écrire, Backspace/Delete pour effacer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (!selected) return;

      if (e.key >= '1' && e.key <= '9') {
        setDigit(Number(e.key) as Digit);
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        clearCell();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, grid]);

  return { grid, selected, selectCell, setDigit, clearCell };
}