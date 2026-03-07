import React from 'react';
import { NotationMode, CellColor } from '@/features/sudoku/model/types';
import { CreditCard as Edit3, Hash, Palette, Type } from 'lucide-react';

interface NotationPanelProps {
  mode: NotationMode;
  onModeChange: (mode: NotationMode) => void;
  onNumberClick: (number: number) => void;
  onColorClick: (color: CellColor) => void;
  onClear: () => void;
}

const colors: CellColor[] = [
  'red', 'blue', 'green', 'yellow', 'purple', 
  'orange', 'pink', 'cyan', 'lime'
];

const colorClasses: Record<CellColor, string> = {
  red: 'bg-red-500/25 hover:bg-red-500/35',
  blue: 'bg-blue-500/25 hover:bg-blue-500/35',
  green: 'bg-emerald-500/25 hover:bg-emerald-500/35',
  yellow: 'bg-amber-500/25 hover:bg-amber-500/35',
  purple: 'bg-violet-500/25 hover:bg-violet-500/35',
  orange: 'bg-orange-500/25 hover:bg-orange-500/35',
  pink: 'bg-pink-500/25 hover:bg-pink-500/35',
  cyan: 'bg-cyan-500/25 hover:bg-cyan-500/35',
  lime: 'bg-lime-500/25 hover:bg-lime-500/35'
};

export const NotationPanel: React.FC<NotationPanelProps> = ({
  mode,
  onModeChange,
  onNumberClick,
  onColorClick,
  onClear
}) => {
  const getModeIcon = (modeType: NotationMode) => {
    switch (modeType) {
      case 'value': return <Type className="w-4 h-4" />;
      case 'corner': return <Hash className="w-4 h-4" />;
      case 'center': return <Edit3 className="w-4 h-4" />;
      case 'color': return <Palette className="w-4 h-4" />;
    }
  };

  const getModeLabel = (modeType: NotationMode) => {
    switch (modeType) {
      case 'value': return 'Valeur';
      case 'corner': return 'Coins';
      case 'center': return 'Centre';
      case 'color': return 'Couleur';
    }
  };

  return (
    <div className="app-surface rounded-2xl p-6 shadow-lg border border-slate-700 space-y-4">
      <h3 className="text-lg font-bold text-slate-100">Mode de notation</h3>
      
      {/* Mode selection */}
      <div className="grid grid-cols-2 gap-2">
        {(['value', 'corner', 'center', 'color'] as NotationMode[]).map(modeType => (
          <button
            key={modeType}
            onClick={() => onModeChange(modeType)}
            className={`
              flex items-center justify-center gap-1 p-2 rounded-lg border-2 transition-colors
              ${mode === modeType 
                ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100 glow-cyan' 
                : 'border-slate-700 text-slate-200 bg-slate-950/30 hover:bg-slate-900/60 hover:border-slate-600'
              }
            `}
          >
            {getModeIcon(modeType)}
            <span className="text-sm font-medium">{getModeLabel(modeType)}</span>
          </button>
        ))}
      </div>

      {/* Number buttons */}
      {mode !== 'color' && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Chiffres</h4>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
              <button
                key={number}
                onClick={() => onNumberClick(number)}
                className="w-10 h-10 bg-slate-950/30 hover:bg-slate-900/60 border border-slate-700 rounded-lg font-semibold text-slate-100 transition-colors"
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color buttons */}
      {mode === 'color' && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Couleurs</h4>
          <div className="grid grid-cols-3 gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => onColorClick(color)}
                className={`w-10 h-10 border-2 border-slate-700 rounded-lg transition-colors ${colorClasses[color]}`}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Clear button */}
      <button
        onClick={onClear}
        className="w-full p-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-400/40 rounded-lg font-medium transition-colors"
      >
        {mode === 'color' ? 'Enlever couleur' : 'Effacer'}
      </button>
    </div>
  );
};