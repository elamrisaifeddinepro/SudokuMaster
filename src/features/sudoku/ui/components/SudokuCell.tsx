import type { Cell } from '@/features/sudoku/model/types';

type Props = {
  cell: Cell;
  isSelected?: boolean;
  isError?: boolean;
  onClick?: (cell: Cell) => void;
};

export default function SudokuCell({ cell, isSelected = false, isError = false, onClick }: Props) {
  const ringClass = isError ? 'ring-2 ring-red-400' : isSelected ? 'ring-2 ring-cyan-400' : '';

  return (
    <button
      type="button"
      onClick={() => onClick?.(cell)}
      className={[
        'relative h-10 w-10 sm:h-12 sm:w-12',
        'flex items-center justify-center transition',
        ringClass,
        cell.given
          ? 'bg-slate-800 text-slate-100 font-bold'
          : 'bg-slate-900 text-slate-300 hover:bg-slate-800/40',
      ].join(' ')}
      title={`r${cell.row} c${cell.col}`}
    >
      {cell.value !== null ? (
        <span className="text-sm sm:text-base">{cell.value}</span>
      ) : (
        <>
          {/* Corner notes (3x3) */}
          <div className="pointer-events-none absolute inset-0 p-1 grid grid-cols-3 grid-rows-3 text-[10px] leading-none text-slate-500">
            {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((d) => (
              <div key={d} className="flex items-center justify-center">
                {cell.cornerNotes.includes(d) ? d : ''}
              </div>
            ))}
          </div>

          {/* Center notes */}
          {cell.centerNotes.length > 0 && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-300">
              {cell.centerNotes.join(' ')}
            </div>
          )}
        </>
      )}
    </button>
  );
}