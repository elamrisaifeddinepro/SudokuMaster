import React from 'react';
import { Trophy, Star, RotateCcw, Zap } from 'lucide-react';

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
  facile: 'Excellent travail pour commencer !',
  moyen: 'Bien joué, vous progressez !',
  difficile: 'Impressionnant, vous maîtrisez !',
  expert: 'Extraordinaire, vous êtes un expert !'
};

export const GameCompletionModal: React.FC<GameCompletionModalProps> = ({
  isOpen,
  difficulty,
  completionTime,
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
        {/* Trophy animation */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/15 border border-amber-400/40 rounded-full mb-4">
            <Trophy className="w-12 h-12 text-amber-200" />
          </div>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-300 fill-current" />
            ))}
          </div>
        </div>

        {/* Success message */}
        <h2 className="text-3xl font-bold text-slate-100 mb-2">
          🎉 Félicitations ! 🎉
        </h2>
        
        <p className="text-lg text-slate-300 mb-4">
          Vous avez résolu le Sudoku !
        </p>

        {/* Difficulty badge */}
        <div className="inline-flex items-center gap-2 bg-slate-950/30 border border-slate-700 px-4 py-2 rounded-full mb-4">
          <span className="text-2xl">{difficultyEmojis[difficulty]}</span>
          <span className="font-semibold text-slate-200 capitalize">
            Niveau {difficulty}
          </span>
        </div>

        <p className="text-slate-300 mb-6">
          {difficultyMessages[difficulty]}
        </p>

        {/* Completion time */}
        <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-cyan-100">
            <span className="text-lg">⏱️</span>
            <span className="font-semibold">Temps de completion:</span>
            <span className="text-xl font-bold">{formatTime(completionTime)}</span>
          </div>
        </div>

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
            <Zap className="w-4 h-4" />
            Continuer
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 text-2xl animate-pulse">🎊</div>
        <div className="absolute top-4 right-4 text-2xl animate-pulse">🎊</div>
        <div className="absolute bottom-4 left-4 text-2xl animate-pulse">✨</div>
        <div className="absolute bottom-4 right-4 text-2xl animate-pulse">✨</div>
      </div>
    </div>
  );
};