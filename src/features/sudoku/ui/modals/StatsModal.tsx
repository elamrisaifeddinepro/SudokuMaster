import React from 'react';
import {
  Activity,
  BarChart3,
  Clock,
  Lightbulb,
  Target,
  Trophy,
  Trash2,
  TrendingUp,
  X
} from 'lucide-react';
import { CompletedGameStat, Difficulty, PlayerStatsStorage, PlayerStatsSummary } from '@/features/sudoku/services/playerStatsStorage';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const difficultyLabels: Record<Difficulty, string> = {
  facile: 'Facile',
  moyen: 'Moyen',
  difficile: 'Difficile',
  expert: 'Expert'
};

const difficultyOrder: readonly Difficulty[] = ['facile', 'moyen', 'difficile', 'expert'];

const formatTime = (totalSeconds: number | null): string => {
  if (totalSeconds === null) return '—';

  const rounded = Math.round(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

const formatNumber = (value: number): string => value.toFixed(1).replace('.', ',');

const percentage = (value: number, max: number): number => {
  if (max <= 0) return 0;
  return Math.max(4, Math.min(100, (value / max) * 100));
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint: string;
  tone: 'cyan' | 'emerald' | 'amber' | 'fuchsia' | 'sky';
}> = ({ icon, label, value, hint, tone }) => {
  const tones = {
    cyan: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-100',
    emerald: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
    amber: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
    fuchsia: 'border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-100',
    sky: 'border-sky-400/30 bg-sky-500/10 text-sky-100'
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div className="text-3xl font-black text-slate-100">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{hint}</div>
    </div>
  );
};

const DifficultyDistributionChart: React.FC<{ summary: PlayerStatsSummary }> = ({ summary }) => {
  const maxGames = Math.max(1, ...difficultyOrder.map(difficulty => summary.byDifficulty[difficulty].gamesCompleted));

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/30 p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-cyan-100" />
        <h3 className="text-lg font-bold text-slate-100">Répartition des parties</h3>
      </div>
      <div className="space-y-3">
        {difficultyOrder.map((difficulty) => {
          const games = summary.byDifficulty[difficulty].gamesCompleted;
          return (
            <div key={difficulty}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-semibold text-slate-200">{difficultyLabels[difficulty]}</span>
                <span className="text-slate-400">{games}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <div
                  className="h-full rounded-full bg-cyan-400/80 shadow-[0_0_14px_rgba(34,211,238,0.45)]"
                  style={{ width: `${percentage(games, maxGames)}%` }}
                  aria-label={`${games} partie${games > 1 ? 's' : ''} en difficulté ${difficultyLabels[difficulty]}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BestTimeChart: React.FC<{ summary: PlayerStatsSummary }> = ({ summary }) => {
  const bestTimes = difficultyOrder
    .map(difficulty => ({ difficulty, time: summary.byDifficulty[difficulty].bestTime }))
    .filter((item): item is { difficulty: Difficulty; time: number } => item.time !== null);

  const maxTime = Math.max(1, ...bestTimes.map(item => item.time));

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/30 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-emerald-100" />
        <h3 className="text-lg font-bold text-slate-100">Meilleurs temps</h3>
      </div>

      {bestTimes.length === 0 ? (
        <p className="text-sm text-slate-500">Terminez au moins une partie pour voir ce graphique.</p>
      ) : (
        <div className="space-y-3">
          {bestTimes.map(({ difficulty, time }) => {
            const invertedWidth = Math.max(10, 100 - percentage(time, maxTime) + 10);
            return (
              <div key={difficulty}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-200">{difficultyLabels[difficulty]}</span>
                  <span className="text-emerald-100 font-semibold">{formatTime(time)}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                  <div
                    className="h-full rounded-full bg-emerald-400/80 shadow-[0_0_14px_rgba(52,211,153,0.45)]"
                    style={{ width: `${invertedWidth}%` }}
                    aria-label={`Meilleur temps ${formatTime(time)} en difficulté ${difficultyLabels[difficulty]}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RecentTrendChart: React.FC<{ games: readonly CompletedGameStat[] }> = ({ games }) => {
  const chronologicalGames = [...games].reverse();
  const maxTime = Math.max(1, ...chronologicalGames.map(game => game.completionTime));

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/30 p-4 lg:col-span-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-fuchsia-100" />
          <h3 className="text-lg font-bold text-slate-100">Évolution récente du temps</h3>
        </div>
        <span className="text-xs text-slate-500">Plus la barre est basse, meilleure est la performance.</span>
      </div>

      <div className="h-48 flex items-end gap-2 border-b border-slate-700 px-1">
        {chronologicalGames.map((game, index) => (
          <div key={game.id} className="flex-1 min-w-0 flex flex-col items-center gap-2">
            <div className="w-full h-36 flex items-end justify-center">
              <div
                className="w-full max-w-8 rounded-t-lg bg-fuchsia-400/75 shadow-[0_0_14px_rgba(232,121,249,0.35)] border border-fuchsia-200/30"
                style={{ height: `${percentage(game.completionTime, maxTime)}%` }}
                title={`${difficultyLabels[game.difficulty]} — ${formatTime(game.completionTime)}`}
                aria-label={`Partie ${index + 1}: ${formatTime(game.completionTime)} en difficulté ${difficultyLabels[game.difficulty]}`}
              />
            </div>
            <span className="text-[10px] text-slate-500 truncate">#{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const [summary, setSummary] = React.useState<PlayerStatsSummary>(() => PlayerStatsStorage.getSummary());

  React.useEffect(() => {
    if (isOpen) {
      setSummary(PlayerStatsStorage.getSummary());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearStats = () => {
    const shouldClear = window.confirm('Voulez-vous vraiment effacer toutes les statistiques locales ?');
    if (!shouldClear) return;

    PlayerStatsStorage.clear();
    setSummary(PlayerStatsStorage.getSummary());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative modal-pop app-surface rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto border border-slate-700">
        <div className="sticky top-0 z-10 app-surface-strong border-b border-slate-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 glow-cyan">
              <BarChart3 className="w-6 h-6 text-cyan-100" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Dashboard joueur</h2>
              <p className="text-sm text-slate-400">Statistiques locales avec graphiques de progression.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Fermer les statistiques"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {summary.gamesCompleted === 0 ? (
            <div className="text-center py-14 rounded-2xl border border-slate-700 bg-slate-950/30">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Aucune statistique pour le moment</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Terminez une grille pour alimenter automatiquement ce dashboard.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                <StatCard icon={<Trophy className="w-4 h-4" />} label="Parties gagnées" value={summary.gamesCompleted} hint="Historique local" tone="cyan" />
                <StatCard icon={<Clock className="w-4 h-4" />} label="Meilleur temps" value={formatTime(summary.bestTime)} hint="Toutes difficultés" tone="emerald" />
                <StatCard icon={<Activity className="w-4 h-4" />} label="Temps moyen" value={formatTime(summary.averageTime)} hint="Moyenne globale" tone="sky" />
                <StatCard icon={<Target className="w-4 h-4" />} label="Erreurs moyennes" value={formatNumber(summary.averageErrors)} hint="Par partie terminée" tone="amber" />
                <StatCard icon={<Lightbulb className="w-4 h-4" />} label="Indices moyens" value={formatNumber(summary.averageHints)} hint="Par partie terminée" tone="fuchsia" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DifficultyDistributionChart summary={summary} />
                <BestTimeChart summary={summary} />
                <RecentTrendChart games={summary.recentGames} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/30 p-4">
                  <h3 className="text-lg font-bold text-slate-100 mb-4">Performance détaillée par difficulté</h3>
                  <div className="space-y-3">
                    {difficultyOrder.map((difficulty) => {
                      const stats = summary.byDifficulty[difficulty];
                      return (
                        <div key={difficulty} className="rounded-xl border border-slate-700 bg-slate-900/40 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-slate-100">{difficultyLabels[difficulty]}</span>
                            <span className="text-xs text-slate-400">{stats.gamesCompleted} partie{stats.gamesCompleted > 1 ? 's' : ''}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div><div className="text-slate-500">Meilleur</div><div className="text-cyan-100 font-semibold">{formatTime(stats.bestTime)}</div></div>
                            <div><div className="text-slate-500">Moyenne</div><div className="text-emerald-100 font-semibold">{formatTime(stats.averageTime)}</div></div>
                            <div><div className="text-slate-500">Erreurs</div><div className="text-amber-100 font-semibold">{formatNumber(stats.averageErrors)}</div></div>
                            <div><div className="text-slate-500">Indices</div><div className="text-fuchsia-100 font-semibold">{formatNumber(stats.averageHints)}</div></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950/30 p-4">
                  <h3 className="text-lg font-bold text-slate-100 mb-4">Dernières parties</h3>
                  <div className="space-y-2">
                    {summary.recentGames.map((game) => (
                      <div key={game.id} className="grid grid-cols-[1fr_auto] gap-3 rounded-xl border border-slate-700 bg-slate-900/40 p-3">
                        <div>
                          <div className="text-slate-100 font-semibold">{difficultyLabels[game.difficulty]}</div>
                          <div className="text-xs text-slate-500">{new Date(game.completedAt).toLocaleString('fr-CA')}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-cyan-100 font-bold">{formatTime(game.completionTime)}</div>
                          <div className="text-slate-400">{game.errorCount} err. · {game.hintsUsed} ind.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center rounded-2xl border border-slate-700 bg-slate-950/30 p-4">
            <p className="text-sm text-slate-400">Ces statistiques sont stockées localement dans votre navigateur. Elles ne sont pas synchronisées avec Supabase.</p>
            <button
              type="button"
              onClick={handleClearStats}
              disabled={summary.gamesCompleted === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                summary.gamesCompleted > 0
                  ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-100 border border-rose-400/40'
                  : 'bg-slate-950/30 text-slate-500 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Effacer les statistiques
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
