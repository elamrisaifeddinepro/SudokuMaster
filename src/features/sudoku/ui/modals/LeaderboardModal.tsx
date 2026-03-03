import type { LeaderboardEntry } from '@/features/sudoku/services/leaderboardLocal';
import { formatTime } from '@/features/sudoku/services/leaderboardLocal';

type Props = {
  isOpen: boolean;
  entries: LeaderboardEntry[];
  onClose: () => void;
  onClear: () => void;
};

export default function LeaderboardModal({ isOpen, entries, onClose, onClear }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">🏆 Leaderboard</h2>
            <p className="mt-1 text-slate-400 text-sm">Top scores (localStorage)</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 px-3 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-100 font-semibold hover:bg-slate-800/40 transition"
          >
            Close
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400">
              <tr className="border-b border-slate-800">
                <th className="py-2 text-left">#</th>
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-left">Time</th>
                <th className="py-2 text-left">Difficulty</th>
                <th className="py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {entries.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-400" colSpan={5}>
                    Aucun score pour le moment.
                  </td>
                </tr>
              ) : (
                entries.map((e, idx) => (
                  <tr key={e.id} className="border-b border-slate-900">
                    <td className="py-2">{idx + 1}</td>
                    <td className="py-2 font-semibold">{e.name}</td>
                    <td className="py-2">{formatTime(e.seconds)}</td>
                    <td className="py-2">{e.difficulty}</td>
                    <td className="py-2 text-slate-400">{new Date(e.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClear}
            className="h-11 w-full rounded-xl border border-slate-800 bg-red-500/10 text-red-200 font-semibold hover:bg-red-500/15 transition"
          >
            Clear leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}