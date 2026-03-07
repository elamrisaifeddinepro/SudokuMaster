import React, { useState } from 'react';
import { Lightbulb, Eye, EyeOff, Target, Zap } from 'lucide-react';
import { Hint } from '@/features/sudoku/model/hintSystem';

interface HintPanelProps {
  onGetHint: (hintType?: string) => void;
  currentHint: Hint | null;
  onApplyHint: () => void;
  onClearHint: () => void;
  hintsUsed: number;
  maxHints: number;
  availableHintTypes: string[];
}

const hintTypeIcons: Record<string, React.ReactNode> = {
  naked_single: <Target className="w-4 h-4" />,
  hidden_single: <Eye className="w-4 h-4" />,
  eliminate: <EyeOff className="w-4 h-4" />,
  pointing: <Zap className="w-4 h-4" />,
  basic_technique: <Lightbulb className="w-4 h-4" />,
  auto: <Lightbulb className="w-4 h-4" />
};

const hintTypeColors: Record<string, string> = {
  naked_single: 'bg-emerald-500/12 text-emerald-200 border-emerald-400/40',
  hidden_single: 'bg-cyan-500/12 text-cyan-100 border-cyan-400/40',
  eliminate: 'bg-amber-500/12 text-amber-200 border-amber-400/40',
  pointing: 'bg-violet-500/12 text-violet-200 border-violet-400/40',
  basic_technique: 'bg-orange-500/12 text-orange-200 border-orange-400/40',
  auto: 'bg-fuchsia-500/12 text-fuchsia-200 border-fuchsia-400/40'
};

const hintTypeNames: Record<string, string> = {
  naked_single: 'Singleton nu',
  hidden_single: 'Singleton caché',
  eliminate: 'Élimination',
  pointing: 'Techniques avancées',
  auto: 'Automatique'
};

export const HintPanel: React.FC<HintPanelProps> = ({
  onGetHint,
  currentHint,
  onApplyHint,
  onClearHint,
  hintsUsed,
  maxHints,
  availableHintTypes
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedHintType, setSelectedHintType] = useState<string>('auto');
  
  const canUseHint = hintsUsed < maxHints;
  
  return (
    <div className="app-surface rounded-2xl p-6 shadow-lg border border-slate-700 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-fuchsia-300" />
          Indices
        </h3>
        <div className="text-sm text-slate-300">
          {hintsUsed} / {maxHints} utilisés
        </div>
      </div>

      {/* Hint counter */}
      <div className="app-surface-strong rounded-lg p-3 border border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-300">Indices disponibles</span>
          <span className={`text-lg font-bold ${canUseHint ? 'text-emerald-300' : 'text-rose-300'}`}>
            {maxHints - hintsUsed}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              canUseHint ? 'bg-emerald-400' : 'bg-rose-400'
            }`}
            style={{ width: `${((maxHints - hintsUsed) / maxHints) * 100}%` }}
          />
        </div>
      </div>

      {/* Get hint button */}
      {/* Hint type selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300">Type d'aide :</label>
        <select
          value={selectedHintType}
          onChange={(e) => setSelectedHintType(e.target.value)}
          className="w-full p-2 bg-slate-950/30 border border-slate-700 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
        >
          <option value="auto">🤖 Automatique (recommandé)</option>
          <option value="naked_single" disabled={!availableHintTypes.includes('naked_single')}>
            🎯 Singleton nu {!availableHintTypes.includes('naked_single') ? '(non disponible)' : ''}
          </option>
          <option value="hidden_single" disabled={!availableHintTypes.includes('hidden_single')}>
            👁️ Singleton caché {!availableHintTypes.includes('hidden_single') ? '(non disponible)' : ''}
          </option>
          <option value="eliminate" disabled={!availableHintTypes.includes('eliminate')}>
            🚫 Élimination {!availableHintTypes.includes('eliminate') ? '(non disponible)' : ''}
          </option>
          <option value="pointing" disabled={!availableHintTypes.includes('pointing')}>
            ⚡ Techniques avancées {!availableHintTypes.includes('pointing') ? '(non disponible)' : ''}
          </option>
        </select>
      </div>

      <button
        onClick={() => onGetHint(selectedHintType)}
        disabled={!canUseHint}
        className={`
          w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors
          ${canUseHint 
            ? 'bg-fuchsia-500/15 hover:bg-fuchsia-500/25 text-fuchsia-200 border border-fuchsia-400/40' 
            : 'bg-slate-950/30 text-slate-500 border border-slate-800 cursor-not-allowed'
          }
        `}
      >
        <Lightbulb className="w-4 h-4" />
        {canUseHint ? `Obtenir un indice ${hintTypeNames[selectedHintType]}` : 'Plus d\'indices disponibles'}
      </button>

      {/* Current hint display */}
      {currentHint && (
        <div className={`border-2 rounded-lg p-4 ${hintTypeColors[currentHint.type]}`}>
          <div className="flex items-start gap-3 mb-3">
            {hintTypeIcons[currentHint.type]}
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1">
                {currentHint.technique}
              </div>
              <div className="text-sm">
                Cellule{currentHint.cells.length > 1 ? 's' : ''} concernée{currentHint.cells.length > 1 ? 's' : ''}: {' '}
                {currentHint.cells.map(cell => `L${cell.row + 1}C${cell.col + 1}`).join(', ')}
              </div>
            </div>
          </div>

          <div className="text-sm mb-3">
            {showDetails ? currentHint.message : `${currentHint.message.substring(0, 100)}...`}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 px-3 py-1 bg-slate-950/40 hover:bg-slate-950/60 border border-slate-700 rounded text-xs font-medium transition-colors"
            >
              {showDetails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showDetails ? 'Masquer' : 'Détails'}
            </button>

            {currentHint.value && (
              <button
                onClick={onApplyHint}
                className="flex items-center gap-1 px-3 py-1 bg-slate-950/40 hover:bg-slate-950/60 border border-slate-700 rounded text-xs font-medium transition-colors"
              >
                <Target className="w-3 h-3" />
                Appliquer
              </button>
            )}

            <button
              onClick={onClearHint}
              className="flex items-center gap-1 px-3 py-1 bg-slate-950/40 hover:bg-slate-950/60 border border-slate-700 rounded text-xs font-medium transition-colors"
            >
              ✕ Fermer
            </button>
          </div>
        </div>
      )}

      {/* Hint types explanation */}
      {!currentHint && (
        <div className="text-xs text-slate-300 space-y-2">
          <div className="font-medium">Types d'indices disponibles :</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-emerald-300" />
              <span><strong>Singleton nu :</strong> Cellule avec une seule valeur possible</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3 text-cyan-300" />
              <span><strong>Singleton caché :</strong> Valeur qui ne peut aller qu'à un endroit</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeOff className="w-3 h-3 text-amber-300" />
              <span><strong>Élimination :</strong> Valeurs impossibles dans une cellule</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-violet-300" />
              <span><strong>Techniques avancées :</strong> Paires pointantes, etc.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};