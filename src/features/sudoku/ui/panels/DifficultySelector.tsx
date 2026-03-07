import React from 'react';
import { DIFFICULTY_LEVELS } from '@/features/sudoku/model/sudokuGenerator';
import { Zap, Target, Flame, Crown } from 'lucide-react';

interface DifficultySelectorProps {
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  onNewPuzzle: (difficulty: string) => void;
}

const difficultyIcons: Record<string, React.ReactNode> = {
  facile: <Zap className="w-5 h-5" />,
  moyen: <Target className="w-5 h-5" />,
  difficile: <Flame className="w-5 h-5" />,
  expert: <Crown className="w-5 h-5" />
};

const difficultyColors: Record<string, string> = {
  facile: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border-emerald-400/40',
  moyen: 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-100 border-cyan-400/40',
  difficile: 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border-amber-400/40',
  expert: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border-rose-400/40'
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultyChange,
  onNewPuzzle
}) => {
  return (
    <div className="app-surface rounded-2xl p-6 shadow-lg border border-slate-700 space-y-4">
      <h3 className="text-lg font-bold text-slate-100">Niveau de difficulté</h3>
      
      <div className="space-y-2">
        {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
          <button
            key={key}
            onClick={() => {
              onDifficultyChange(key);
              onNewPuzzle(key);
            }}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors font-medium
              ${selectedDifficulty === key 
                ? difficultyColors[key] + ' ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950' 
                : 'border-slate-700 text-slate-200 bg-slate-950/30 hover:bg-slate-900/60 hover:border-slate-600'
              }
            `}
          >
            {difficultyIcons[key]}
            <div className="flex-1 text-left">
              <div className="font-semibold">{level.name}</div>
              <div className="text-sm opacity-75">{level.description}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-700">
        <button
          onClick={() => onNewPuzzle(selectedDifficulty)}
          className={`
            w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors font-medium
            ${difficultyColors[selectedDifficulty]}
          `}
        >
          {difficultyIcons[selectedDifficulty]}
          Nouvelle grille {DIFFICULTY_LEVELS[selectedDifficulty].name.toLowerCase()}
        </button>
      </div>
    </div>
  );
};