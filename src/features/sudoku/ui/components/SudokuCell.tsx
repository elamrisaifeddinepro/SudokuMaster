import React from 'react';
import { Cell, CellColor } from '@/features/sudoku/model/types';

interface SudokuCellProps {
  cell: Cell;
  isSelected: boolean;
  hasError: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

const colorClasses: Record<CellColor, string> = {
  red: 'bg-red-500/15 hover:bg-red-500/25',
  blue: 'bg-blue-500/15 hover:bg-blue-500/25',
  green: 'bg-emerald-500/15 hover:bg-emerald-500/25',
  yellow: 'bg-amber-500/15 hover:bg-amber-500/25',
  purple: 'bg-violet-500/15 hover:bg-violet-500/25',
  orange: 'bg-orange-500/15 hover:bg-orange-500/25',
  pink: 'bg-pink-500/15 hover:bg-pink-500/25',
  cyan: 'bg-cyan-500/15 hover:bg-cyan-500/25',
  lime: 'bg-lime-500/15 hover:bg-lime-500/25'
};

export const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  isSelected,
  hasError,
  onClick,
  onDoubleClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // Store the event in window for access in the hook
    (window as any).event = e.nativeEvent;
    onClick();
  };

  const getBackgroundClass = () => {
    if (hasError) return 'bg-rose-500/25 border-rose-400';
    if (isSelected) return 'bg-cyan-500/20 border-cyan-300 glow-cyan';
    if (cell.color) return colorClasses[cell.color];
    return 'bg-slate-950/20 hover:bg-slate-900/50';
  };

  const getBorderClass = () => {
    const baseClasses = 'border-2';
    const rightBorder = (cell.col + 1) % 3 === 0 && cell.col !== 8 ? 'border-r-4 border-r-slate-500/80' : '';
    const bottomBorder = (cell.row + 1) % 3 === 0 && cell.row !== 8 ? 'border-b-4 border-b-slate-500/80' : '';
    
    return `${baseClasses} ${rightBorder} ${bottomBorder}`;
  };

  return (
    <div
      className={`
        relative w-14 h-14 cursor-pointer transition-all duration-200 hover:scale-105
        ${getBackgroundClass()}
        ${getBorderClass()}
        border-slate-700/60 shadow-sm hover:shadow-lg
      `}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
    >
      {/* Main value */}
      {cell.value && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-extrabold text-slate-50 drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)]">
            {cell.value}
          </span>
        </div>
      )}
      
      {/* Corner notes */}
      {cell.cornerNotes.length > 0 && !cell.value && (
        <div className="grid grid-cols-2 gap-0 h-full text-xs font-medium">
          {/* Top-left corner */}
          <div className="flex items-start justify-start text-slate-200 font-semibold pl-0.5 pt-0.5">
            {cell.cornerNotes[0] || ''}
          </div>
          {/* Top-right corner */}
          <div className="flex items-start justify-end text-slate-200 font-semibold pr-0.5 pt-0.5">
            {cell.cornerNotes[1] || ''}
          </div>
          {/* Bottom-left corner */}
          <div className="flex items-end justify-start text-slate-200 font-semibold pl-0.5 pb-0.5">
            {cell.cornerNotes[2] || ''}
          </div>
          {/* Bottom-right corner */}
          <div className="flex items-end justify-end text-slate-200 font-semibold pr-0.5 pb-0.5">
            {cell.cornerNotes[3] || ''}
          </div>
        </div>
      )}
      
      {/* Center notes */}
      {cell.centerNotes.length > 0 && !cell.value && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm text-slate-200 font-semibold leading-tight text-center">
            {cell.centerNotes.join('')}
          </div>
        </div>
      )}
    </div>
  );
};