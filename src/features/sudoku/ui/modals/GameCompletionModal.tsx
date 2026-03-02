type Props = {
  isOpen: boolean;
  timeSeconds: number;
  onClose: () => void;
  onNewGame: () => void;
};

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

function formatTime(seconds: number) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${pad2(mm)}:${pad2(ss)}`;
}

export default function GameCompletionModal({ isOpen, timeSeconds, onClose, onNewGame }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-emerald-200">🎉 Sudoku complété !</h2>
        <p className="mt-2 text-slate-300">
          Temps: <b className="text-slate-100">{formatTime(timeSeconds)}</b>
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onNewGame}
            className="flex-1 h-11 rounded-xl border border-slate-800 bg-emerald-500/10 text-emerald-200 font-semibold hover:bg-emerald-500/15 transition"
          >
            New Game
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-100 font-semibold hover:bg-slate-800/40 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}