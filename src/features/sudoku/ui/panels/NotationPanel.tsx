import type { Digit } from '@/features/sudoku/model/types';

type Props = {
  onDigit: (d: Digit) => void;
  onClear: () => void;
};

const DIGITS: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function NotationPanel({ onDigit, onClear }: Props) {
  return (
    <aside className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-semibold">Notation</h2>
      <p className="mt-1 text-sm text-slate-400">Clique un numéro pour l’écrire dans la case sélectionnée.</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {DIGITS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onDigit(d)}
            className={[
              'h-12 rounded-xl',
              'border border-slate-800',
              'bg-slate-950/50',
              'text-slate-100 font-semibold',
              'hover:bg-slate-800/40 transition',
            ].join(' ')}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={onClear}
          className="w-full h-11 rounded-xl border border-slate-800 bg-red-500/10 text-red-200 font-semibold hover:bg-red-500/15 transition"
        >
          Clear (Delete)
        </button>
      </div>
    </aside>
  );
}