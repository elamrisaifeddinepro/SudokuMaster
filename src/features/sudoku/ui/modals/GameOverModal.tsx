import React from 'react';
import { Skull, RotateCcw, AlertTriangle } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  difficulty: string;
  gameTime: number;
  errorCount: number;
  maxErrors: number;
  onNewGame: () => void;
  onClose: () => void;
}

const difficultyEmojis: Record<string, string> = {
  facile: '🟢',
  moyen: '🟡', 
  difficile: '🟠',
  expert: '🔴'
};

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  difficulty,
  gameTime,
  errorCount,
  maxErrors,
  onNewGame,
  onClose
}) => {
  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative app-surface rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Skull animation */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-500/15 border border-rose-400/40 rounded-full mb-4">
            <Skull className="w-12 h-12 text-rose-200" />
          </div>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(3)].map((_, i) => (
              <AlertTriangle key={i} className="w-6 h-6 text-rose-300 fill-current" />
            ))}
          </div>
        </div>

        {/* Game Over message */}
        <h2 className="text-3xl font-bold text-slate-100 mb-2">
          💀 Partie Terminée ! 💀
        </h2>
        
        <p className="text-lg text-slate-300 mb-4">
          Trop d'erreurs commises !
        </p>

        {/* Difficulty badge */}
        <div className="inline-flex items-center gap-2 bg-slate-950/30 border border-slate-700 px-4 py-2 rounded-full mb-4">
          <span className="text-2xl">{difficultyEmojis[difficulty]}</span>
          <span className="font-semibold text-slate-200 capitalize">
            Niveau {difficulty}
          </span>
        </div>

        {/* Error count */}
        <div className="bg-rose-500/10 border border-rose-400/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center gap-2 text-rose-200 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Erreurs commises:</span>
          </div>
          <div className="text-2xl font-bold text-rose-100">
            {errorCount} / {maxErrors}
          </div>
        </div>

        {/* Game time */}
        <div className="bg-slate-950/30 border border-slate-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-slate-200">
            <span className="text-lg">⏱️</span>
            <span className="font-semibold">Temps de jeu:</span>
            <span className="text-xl font-bold">{formatTime(gameTime)}</span>
          </div>
        </div>

        <p className="text-slate-300 mb-6">
          Essayez à nouveau et faites plus attention aux erreurs !
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onNewGame}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-400/40 glow-cyan rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Nouvelle partie
          </button>
          
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 bg-slate-950/30 hover:bg-slate-900/60 text-slate-200 border border-slate-700 rounded-lg font-medium transition-colors"
          >
            Fermer
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 text-2xl animate-bounce">💥</div>
        <div className="absolute top-4 right-4 text-2xl animate-bounce">💥</div>
        <div className="absolute bottom-4 left-4 text-2xl animate-bounce">⚠️</div>
        <div className="absolute bottom-4 right-4 text-2xl animate-bounce">⚠️</div>
      </div>
    </div>
  );
};