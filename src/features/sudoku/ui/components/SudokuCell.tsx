import type { Cell } from '@/features/sudoku/model/types';

type Props = {
  cell: Cell;
  onClick?: (cell: Cell) => void;
};

export default function SudokuCell({ cell, onClick }: Props) {
  const isGiven = cell.given;

  return (
    <button
      type="button"
      onClick={() => onClick?.(cell)}
      className={[
        'h-10 w-10 sm:h-12 sm:w-12',
        'flex items-center justify-center',
        'text-sm sm:text-base',
        'border border-slate-800',
        'transition',
        isGiven ? 'bg-slate-800 text-slate-100 font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-800/40',
      ].join(' ')}
      title={`r${cell.row} c${cell.col}`}
    >
      {cell.value ?? ''}
    </button>
  );
}