import React from 'react';
import { SudokuCell } from './SudokuCell';
import { GridState } from '@/features/sudoku/model/types';

interface SudokuGridProps {
  gridState: GridState;
  onCellClick: (row: number, col: number) => void;
  onCellDoubleClick: (row: number, col: number) => void;
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({
  gridState,
  onCellClick,
  onCellDoubleClick
}) => {
  const isCellSelected = (row: number, col: number): boolean => {
    return gridState.selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellError = (row: number, col: number): boolean => {
    return gridState.errors.some(error => error.row === row && error.col === col);
  };

  return (
    <div className="inline-block app-surface rounded-3xl p-4 shadow-2xl border border-slate-700">
      <div className="grid grid-cols-9 gap-0 app-surface-strong p-3 rounded-2xl border border-slate-700">
        {gridState.grid.cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              isSelected={isCellSelected(rowIndex, colIndex)}
              hasError={isCellError(rowIndex, colIndex)}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onDoubleClick={() => onCellDoubleClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};