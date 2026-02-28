type Props = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;

  onNewGame: () => void;

  timerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;

  onSave: () => void;
  onLoad: () => void;
};

function btn(base: string, disabled?: boolean) {
  return [
    'h-11 w-full rounded-xl border border-slate-800 px-4 font-semibold transition',
    base,
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800/40',
  ].join(' ');
}

export default function ControlPanel({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onNewGame,
  timerRunning,
  onToggleTimer,
  onResetTimer,
  onSave,
  onLoad,
}: Props) {
  return (
    <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-semibold">Controls</h2>
      <p className="mt-1 text-sm text-slate-400">New game, undo/redo, timer, save/load.</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={onUndo} disabled={!canUndo} className={btn('bg-slate-950/50 text-slate-100', !canUndo)}>
          Undo
        </button>
        <button type="button" onClick={onRedo} disabled={!canRedo} className={btn('bg-slate-950/50 text-slate-100', !canRedo)}>
          Redo
        </button>
      </div>

      <div className="mt-3">
        <button type="button" onClick={onNewGame} className={btn('bg-cyan-500/15 text-cyan-200')}>
          New Game
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={onToggleTimer} className={btn('bg-slate-950/50 text-slate-100')}>
          {timerRunning ? 'Pause Timer' : 'Start Timer'}
        </button>
        <button type="button" onClick={onResetTimer} className={btn('bg-slate-950/50 text-slate-100')}>
          Reset Timer
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={onSave} className={btn('bg-emerald-500/10 text-emerald-200')}>
          Save
        </button>
        <button type="button" onClick={onLoad} className={btn('bg-amber-500/10 text-amber-200')}>
          Load
        </button>
      </div>
    </section>
  );
}