import type { NotationMode, Position } from '@/features/sudoku/model/types';

type Props = {
  mode: NotationMode;
  difficulty: string;
  selected: Position | null;
  conflictsCount: number;
  givensCount: number;
  timerSeconds: number;
  timerRunning: boolean;
  leaderboardSourceLabel: string;
  lastSavedName?: string | null;
};

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

function formatTime(seconds: number) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${pad2(mm)}:${pad2(ss)}`;
}

export default function StatusCard({
  mode,
  difficulty,
  selected,
  conflictsCount,
  givensCount,
  timerSeconds,
  timerRunning,
  leaderboardSourceLabel,
  lastSavedName,
}: Props) {
  return (
    <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Status</h2>
          <p className="mt-1 text-sm text-slate-400">Infos + raccourcis clavier</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Timer</div>
          <div className="text-lg font-bold">{formatTime(timerSeconds)}</div>
          <div className="text-xs text-slate-400">{timerRunning ? 'RUN' : 'PAUSE'}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <div className="text-slate-400">Mode</div>
          <div className="font-semibold text-slate-100">{mode}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <div className="text-slate-400">Difficulty</div>
          <div className="font-semibold text-slate-100">{difficulty}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <div className="text-slate-400">Selected</div>
          <div className="font-semibold text-slate-100">
            {selected ? `(${selected.row}, ${selected.col})` : 'None'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <div className="text-slate-400">Conflicts</div>
          <div className="font-semibold text-slate-100">{conflictsCount}</div>
        </div>

        <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <div className="text-slate-400">Givens</div>
          <div className="font-semibold text-slate-100">{givensCount} / 81</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-400">Leaderboard:</span>
          <span className="font-semibold text-slate-100">{leaderboardSourceLabel}</span>
          {lastSavedName ? (
            <>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Last saved:</span>
              <span className="font-semibold text-emerald-200">{lastSavedName}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
        <div className="text-sm font-semibold text-slate-100">Shortcuts</div>
        <ul className="mt-2 grid gap-1 text-sm text-slate-300">
          <li>• 1..9 : entrer un chiffre</li>
          <li>• Backspace / Delete : clear (selon mode)</li>
          <li>• Ctrl+Z : Undo</li>
          <li>• Ctrl+Y : Redo</li>
        </ul>
      </div>
    </section>
  );
}