import type { Cell } from '@/features/sudoku/model/types';

type Props = {
  cell: Cell;
  isSelected?: boolean;
  isError?: boolean;
  onClick?: (cell: Cell) => void;
};

export default function SudokuCell({ cell, isSelected = false, isError = false, onClick }: Props) {
  const isGiven = cell.given;

  const ringClass = isError
    ? 'ring-2 ring-red-400'
    : isSelected
      ? 'ring-2 ring-cyan-400'
      : '';

  return (
    <button
      type="button"
      onClick={() => onClick?.(cell)}
      className={[
        'h-10 w-10 sm:h-12 sm:w-12',
        'flex items-center justify-center',
        'text-sm sm:text-base',
        'transition',
        ringClass,
        isGiven
          ? 'bg-slate-800 text-slate-100 font-bold'
          : 'bg-slate-900 text-slate-300 hover:bg-slate-800/40',
      ].join(' ')}
      title={`r${cell.row} c${cell.col}`}
    >
      {cell.value ?? ''}
    </button>
  );
}