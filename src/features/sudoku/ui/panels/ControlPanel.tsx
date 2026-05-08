import React from 'react';
import { Undo, Redo, Save, Upload, RotateCcw, Trophy, Pause, Play, RefreshCcw, Trash2, BarChart3 } from 'lucide-react';
import { useI18n } from '@/shared/i18n/i18n';

interface ControlPanelProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onNewGame: () => void;
  onTogglePause: () => void;
  onRestoreLocalSave: () => void;
  onClearLocalSave: () => void;
  isPaused: boolean;
  hasLocalSave: boolean;
  lastLocalSaveAt: number | null;
  onShowLeaderboard: () => void;
  onShowStats: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  canUndo, canRedo, onUndo, onRedo, onSave, onLoad, onNewGame, onTogglePause,
  onRestoreLocalSave, onClearLocalSave, isPaused, hasLocalSave, lastLocalSaveAt,
  onShowLeaderboard, onShowStats
}) => {
  const { language, t } = useI18n();
  const localSaveDate = lastLocalSaveAt
    ? new Date(lastLocalSaveAt).toLocaleString(language === 'fr' ? 'fr-CA' : 'en-CA')
    : t('control.available');

  return (
    <div className="app-surface rounded-2xl p-6 shadow-lg border border-slate-700 space-y-4">
      <h3 className="text-lg font-bold text-slate-100">{t('toolbar.controls')}</h3>
      <div className="flex gap-2">
        <button onClick={onUndo} disabled={!canUndo} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${canUndo ? 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-100 border border-cyan-400/40' : 'bg-slate-950/30 text-slate-500 border border-slate-800 cursor-not-allowed'}`}>
          <Undo className="w-4 h-4" />{t('control.undo')}
        </button>
        <button onClick={onRedo} disabled={!canRedo} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${canRedo ? 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-100 border border-cyan-400/40' : 'bg-slate-950/30 text-slate-500 border border-slate-800 cursor-not-allowed'}`}>
          <Redo className="w-4 h-4" />{t('control.redo')}
        </button>
      </div>
      <button onClick={onTogglePause} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-100 border border-cyan-400/40 rounded-lg font-medium transition-colors">
        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}{isPaused ? t('control.resume') : t('control.pause')}
      </button>
      <div className="rounded-xl border border-slate-700 bg-slate-950/30 p-3 space-y-2">
        <div className="text-xs text-slate-300">{hasLocalSave ? t('control.saveAt', { date: localSaveDate }) : t('control.noSave')}</div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onRestoreLocalSave} disabled={!hasLocalSave} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${hasLocalSave ? 'bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-100 border border-indigo-400/40' : 'bg-slate-950/30 text-slate-500 border border-slate-800 cursor-not-allowed'}`}>
            <RefreshCcw className="w-4 h-4" />{t('control.restore')}
          </button>
          <button onClick={onClearLocalSave} disabled={!hasLocalSave} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${hasLocalSave ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-100 border border-rose-400/40' : 'bg-slate-950/30 text-slate-500 border border-slate-800 cursor-not-allowed'}`}>
            <Trash2 className="w-4 h-4" />{t('control.clear')}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <button onClick={onSave} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 rounded-lg font-medium transition-colors"><Save className="w-4 h-4" />{t('control.save')}</button>
        <button onClick={onLoad} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-400/40 rounded-lg font-medium transition-colors"><Upload className="w-4 h-4" />{t('control.load')}</button>
      </div>
      <button onClick={onNewGame} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-fuchsia-500/15 hover:bg-fuchsia-500/25 text-fuchsia-200 border border-fuchsia-400/40 rounded-lg font-medium transition-colors"><RotateCcw className="w-4 h-4" />{t('control.newGrid')}</button>
      <div className="grid grid-cols-1 gap-2">
        <button onClick={onShowLeaderboard} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-400/40 rounded-lg font-medium transition-colors"><Trophy className="w-4 h-4" />{t('control.leaderboard')}</button>
        <button onClick={onShowStats} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-100 border border-sky-400/40 rounded-lg font-medium transition-colors"><BarChart3 className="w-4 h-4" />{t('control.stats')}</button>
      </div>
    </div>
  );
};
