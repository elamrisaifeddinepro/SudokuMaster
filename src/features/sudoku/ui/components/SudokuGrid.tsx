import React from 'react';
import { SudokuCell } from './SudokuCell';
import { GridState } from '@/features/sudoku/model/types';

interface SudokuGridProps {
  gridState: GridState;
  onCellClick: (row: number, col: number, isMultiSelect?: boolean) => void;
  onCellDoubleClick: (row: number, col: number) => void;
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({
  gridState,
  onCellClick,
  onCellDoubleClick
}) => {
  const selectedCell = gridState.selectedCells.length > 0
    ? gridState.selectedCells[gridState.selectedCells.length - 1]
    : undefined;

  React.useEffect(() => {
    if (!selectedCell) return;
    const selectedElement = document.getElementById(`sudoku-cell-${selectedCell.row}-${selectedCell.col}`);
    selectedElement?.focus({ preventScroll: true });
  }, [selectedCell]);

  const isCellSelected = (row: number, col: number): boolean => {
    return gridState.selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellError = (row: number, col: number): boolean => {
    return gridState.errors.some(error => error.row === row && error.col === col);
  };

  const isCellKeyboardFocusable = (row: number, col: number): boolean => {
    if (!selectedCell) return row === 0 && col === 0;
    return selectedCell.row === row && selectedCell.col === col;
  };

  return (
    <div className="inline-block app-surface rounded-3xl p-4 shadow-2xl border border-slate-700">
      <div
        className="grid grid-cols-9 gap-0 app-surface-strong p-3 rounded-2xl border border-slate-700"
        role="grid"
        aria-label="Grille de Sudoku 9 par 9"
        aria-rowcount={9}
        aria-colcount={9}
      >
        {gridState.grid.cells.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((cell, colIndex) => (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                isSelected={isCellSelected(rowIndex, colIndex)}
                hasError={isCellError(rowIndex, colIndex)}
                isKeyboardFocusable={isCellKeyboardFocusable(rowIndex, colIndex)}
                onClick={(isMultiSelect) => onCellClick(rowIndex, colIndex, isMultiSelect)}
                onDoubleClick={() => onCellDoubleClick(rowIndex, colIndex)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
