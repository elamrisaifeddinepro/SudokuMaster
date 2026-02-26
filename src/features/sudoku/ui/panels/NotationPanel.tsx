import type { Digit, NotationMode } from '@/features/sudoku/model/types';

type Props = {
  mode: NotationMode;
  onModeChange: (m: NotationMode) => void;
  onDigit: (d: Digit) => void;
  onClear: () => void;
};

const DIGITS: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function modeBtn(active: boolean) {
  return [
    'h-10 rounded-xl border border-slate-800 px-3 font-semibold transition',
    active ? 'bg-cyan-500/15 text-cyan-200' : 'bg-slate-950/50 text-slate-200 hover:bg-slate-800/40',
  ].join(' ');
}

export default function NotationPanel({ mode, onModeChange, onDigit, onClear }: Props) {
  return (
    <aside className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-semibold">Notation</h2>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button type="button" className={modeBtn(mode === 'value')} onClick={() => onModeChange('value')}>
          Value
        </button>
        <button type="button" className={modeBtn(mode === 'corner')} onClick={() => onModeChange('corner')}>
          Corner
        </button>
        <button type="button" className={modeBtn(mode === 'center')} onClick={() => onModeChange('center')}>
          Center
        </button>
      </div>

      <p className="mt-3 text-sm text-slate-400">
        Mode actuel : <b className="text-slate-200">{mode.toUpperCase()}</b>
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {DIGITS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onDigit(d)}
            className="h-12 rounded-xl border border-slate-800 bg-slate-950/50 text-slate-100 font-semibold hover:bg-slate-800/40 transition"
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
          Clear (selon mode)
        </button>
      </div>
    </aside>
  );
}