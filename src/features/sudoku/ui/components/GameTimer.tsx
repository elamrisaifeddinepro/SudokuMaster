type Props = {
  seconds: number;
  isRunning: boolean;
};

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

export default function GameTimer({ seconds, isRunning }: Props) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3">
      <div className="text-xs uppercase tracking-wider text-slate-400">Timer</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-100">
          {pad2(mm)}:{pad2(ss)}
        </span>
        <span className={isRunning ? 'text-emerald-300 text-sm' : 'text-amber-300 text-sm'}>
          {isRunning ? 'RUN' : 'PAUSE'}
        </span>
      </div>
    </div>
  );
}