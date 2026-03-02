type Props = {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
};

export default function GameOverModal({ isOpen, onClose, onNewGame }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-red-200">💥 Game Over</h2>
        <p className="mt-2 text-slate-300">
          Trop d’erreurs. Tu peux recommencer une nouvelle partie.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onNewGame}
            className="flex-1 h-11 rounded-xl border border-slate-800 bg-red-500/10 text-red-200 font-semibold hover:bg-red-500/15 transition"
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