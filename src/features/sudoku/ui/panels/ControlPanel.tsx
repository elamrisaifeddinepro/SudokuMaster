import React from 'react';
import { Undo, Redo, Save, Upload, RotateCcw, Trophy } from 'lucide-react';

interface ControlPanelProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onNewGame: () => void;
  onShowLeaderboard: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onNewGame,
  onShowLeaderboard
}) => {
  return (
    <div className="app-surface rounded-2xl p-6 shadow-lg border border-slate-700 space-y-4">
      <h3 className="text-lg font-bold text-slate-100">Contrôles</h3>
      
      {/* Undo/Redo */}
      <div className="flex gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${canUndo 
              ? 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-100 border border-cyan-400/40' 
              : 'bg-slate-950/30 text-slate-500 border border-slate-800 cursor-not-allowed'
            }
          `}
        >
          <Undo className="w-4 h-4" />
          Annuler
        </button>
        
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${canRedo 
              ? 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-100 border border-cyan-400/40' 
              : 'bg-slate-950/30 text-slate-500 border border-slate-800 cursor-not-allowed'
            }
          `}
        >
          <Redo className="w-4 h-4" />
          Refaire
        </button>
      </div>

      {/* File operations */}
      <div className="space-y-2">
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 rounded-lg font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          Sauvegarder
        </button>
        
        <button
          onClick={onLoad}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-400/40 rounded-lg font-medium transition-colors"
        >
          <Upload className="w-4 h-4" />
          Charger
        </button>
      </div>

      {/* New game */}
      <button
        onClick={onNewGame}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-fuchsia-500/15 hover:bg-fuchsia-500/25 text-fuchsia-200 border border-fuchsia-400/40 rounded-lg font-medium transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Nouvelle grille
      </button>

      {/* Leaderboard */}
      <button
        onClick={onShowLeaderboard}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-400/40 rounded-lg font-medium transition-colors"
      >
        <Trophy className="w-4 h-4" />
        Tableau d'honneur
      </button>
    </div>
  );
};