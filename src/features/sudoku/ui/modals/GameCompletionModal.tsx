import React from 'react';
import { Trophy, Star, RotateCcw, Sparkles, Zap, Clock3, Medal } from 'lucide-react';

interface GameCompletionModalProps {
  isOpen: boolean;
  difficulty: string;
  completionTime: number;
  onNewGame: () => void;
  onClose: () => void;
}

const difficultyEmojis: Record<string, string> = {
  facile: '🟢',
  moyen: '🟡',
  difficile: '🟠',
  expert: '🔴'
};

const difficultyMessages: Record<string, string> = {
  facile: 'Excellent démarrage : précision, calme et régularité.',
  moyen: 'Belle performance : vous progressez avec méthode.',
  difficile: 'Très solide : vous maîtrisez les raisonnements avancés.',
  expert: 'Performance remarquable : niveau expert confirmé.'
};

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

const confettiPieces = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 41) % 84)}%`,
  delay: `${(index % 7) * 0.18}s`,
  duration: `${2.4 + (index % 5) * 0.25}s`,
  symbol: ['✦', '◆', '✧', '●', '★'][index % 5]
}));

export const GameCompletionModal: React.FC<GameCompletionModalProps> = ({
  isOpen,
  difficulty,
  completionTime,
  onNewGame,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/70 p-4 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {confettiPieces.map((piece) => (
          <span
            key={piece.id}
            className="victory-confetti"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration
            }}
          >
            {piece.symbol}
          </span>
        ))}
      </div>

      <div className="modal-pop relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-slate-950/85 p-1 shadow-2xl shadow-cyan-950/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.25),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(217,70,239,0.22),transparent_32%)]" aria-hidden="true" />
        <div className="relative rounded-[1.8rem] border border-white/10 bg-slate-950/70 p-8 text-center backdrop-blur-xl">
          <div className="absolute left-6 top-6 text-cyan-200/70 animate-float-slow" aria-hidden="true">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="absolute right-6 top-8 text-fuchsia-200/70 animate-float-slower" aria-hidden="true">
            <Star className="h-5 w-5 fill-current" />
          </div>

          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/10 shadow-[0_0_45px_rgba(251,191,36,0.28)] animate-trophy-pulse">
              <Trophy className="h-14 w-14 text-amber-200" />
            </div>
            <div className="flex justify-center gap-1.5" aria-hidden="true">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="h-5 w-5 fill-current text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.45)]" />
              ))}
            </div>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.45em] text-cyan-200/80">
            Puzzle terminé
          </p>
          <h2 className="mb-3 text-4xl font-black tracking-tight text-slate-50 sm:text-5xl">
            Victoire
          </h2>
          <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate-300">
            {difficultyMessages[difficulty] ?? 'Très belle performance : votre grille est complète et validée.'}
          </p>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-4 text-left">
              <div className="mb-2 flex items-center gap-2 text-cyan-100">
                <Clock3 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Temps</span>
              </div>
              <p className="text-2xl font-black text-white">{formatTime(completionTime)}</p>
            </div>

            <div className="rounded-2xl border border-fuchsia-400/25 bg-fuchsia-400/10 p-4 text-left">
              <div className="mb-2 flex items-center gap-2 text-fuchsia-100">
                <Medal className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Niveau</span>
              </div>
              <p className="text-2xl font-black capitalize text-white">
                <span className="mr-2">{difficultyEmojis[difficulty]}</span>
                {difficulty}
              </p>
            </div>
          </div>

          <div className="mb-7 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
            <span className="text-cyan-200">✨ Conseil :</span> consultez le dashboard joueur pour suivre votre progression par difficulté.
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onNewGame}
              className="premium-button flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/40 bg-cyan-400/15 px-6 py-3 font-bold text-cyan-50 transition hover:bg-cyan-400/25"
            >
              <RotateCcw className="h-4 w-4" />
              Nouvelle partie
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-600 bg-slate-900/70 px-6 py-3 font-semibold text-slate-100 transition hover:border-fuchsia-300/40 hover:bg-slate-800"
            >
              <Zap className="h-4 w-4" />
              Continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
