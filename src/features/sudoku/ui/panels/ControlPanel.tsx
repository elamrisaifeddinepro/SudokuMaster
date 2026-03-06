type Props = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;

  onNewGame: () => void;     // restart same puzzle
  onNewPuzzle: () => void;   // generate new puzzle

  timerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;

  onSave: () => void;
  onLoad: () => void;

  onOpenLeaderboard: () => void;
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
  onNewPuzzle,
  timerRunning,
  onToggleTimer,
  onResetTimer,
  onSave,
  onLoad,
  onOpenLeaderboard,
}: Props) {
  return (
    <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-semibold">Controls</h2>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={onUndo} disabled={!canUndo} className={btn('bg-slate-950/50 text-slate-100', !canUndo)}>
          Undo
        </button>
        <button type="button" onClick={onRedo} disabled={!canRedo} className={btn('bg-slate-950/50 text-slate-100', !canRedo)}>
          Redo
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={onNewGame} className={btn('bg-cyan-500/15 text-cyan-200')}>
          Restart
        </button>
        <button type="button" onClick={onNewPuzzle} className={btn('bg-purple-500/10 text-purple-200')}>
          New Puzzle
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

      <div className="mt-4">
        <button type="button" onClick={onOpenLeaderboard} className={btn('bg-slate-950/50 text-slate-100')}>
          Leaderboard
        </button>
      </div>
    </section>
  );
}