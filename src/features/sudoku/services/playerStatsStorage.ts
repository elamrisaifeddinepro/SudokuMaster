export type Difficulty = 'facile' | 'moyen' | 'difficile' | 'expert';

export interface CompletedGameStat {
  readonly id: string;
  readonly difficulty: Difficulty;
  readonly completionTime: number;
  readonly errorCount: number;
  readonly hintsUsed: number;
  readonly completedAt: number;
}

export interface DifficultySummary {
  readonly gamesCompleted: number;
  readonly bestTime: number | null;
  readonly averageTime: number | null;
  readonly averageErrors: number;
  readonly averageHints: number;
}

export interface PlayerStatsSummary {
  readonly gamesCompleted: number;
  readonly bestTime: number | null;
  readonly averageTime: number | null;
  readonly averageErrors: number;
  readonly averageHints: number;
  readonly lastCompletedAt: number | null;
  readonly byDifficulty: Record<Difficulty, DifficultySummary>;
  readonly recentGames: readonly CompletedGameStat[];
}

const STORAGE_KEY = 'sudoku-master-player-stats-v1';
const DIFFICULTIES: readonly Difficulty[] = ['facile', 'moyen', 'difficile', 'expert'];
const MAX_HISTORY_SIZE = 200;

const emptyDifficultySummary = (): DifficultySummary => ({
  gamesCompleted: 0,
  bestTime: null,
  averageTime: null,
  averageErrors: 0,
  averageHints: 0
});

const isDifficulty = (value: string): value is Difficulty => (
  DIFFICULTIES.includes(value as Difficulty)
);

const isValidStat = (value: unknown): value is CompletedGameStat => {
  if (!value || typeof value !== 'object') return false;

  const stat = value as Record<string, unknown>;
  return (
    typeof stat.id === 'string' &&
    typeof stat.difficulty === 'string' &&
    isDifficulty(stat.difficulty) &&
    typeof stat.completionTime === 'number' &&
    Number.isFinite(stat.completionTime) &&
    stat.completionTime > 0 &&
    typeof stat.errorCount === 'number' &&
    Number.isFinite(stat.errorCount) &&
    stat.errorCount >= 0 &&
    typeof stat.hintsUsed === 'number' &&
    Number.isFinite(stat.hintsUsed) &&
    stat.hintsUsed >= 0 &&
    typeof stat.completedAt === 'number' &&
    Number.isFinite(stat.completedAt)
  );
};

const calculateAverage = (values: readonly number[]): number | null => {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const buildDifficultySummary = (games: readonly CompletedGameStat[]): DifficultySummary => {
  if (games.length === 0) return emptyDifficultySummary();

  const times = games.map(game => game.completionTime);
  const errors = games.map(game => game.errorCount);
  const hints = games.map(game => game.hintsUsed);

  return {
    gamesCompleted: games.length,
    bestTime: Math.min(...times),
    averageTime: calculateAverage(times),
    averageErrors: calculateAverage(errors) ?? 0,
    averageHints: calculateAverage(hints) ?? 0
  };
};

export class PlayerStatsStorage {
  static load(): CompletedGameStat[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter(isValidStat)
        .sort((a, b) => b.completedAt - a.completedAt)
        .slice(0, MAX_HISTORY_SIZE);
    } catch (error) {
      console.warn('Impossible de charger les statistiques locales:', error);
      return [];
    }
  }

  static addCompletedGame(input: Omit<CompletedGameStat, 'id' | 'completedAt'>): CompletedGameStat {
    if (!isDifficulty(input.difficulty)) {
      throw new Error('Difficulté invalide pour les statistiques.');
    }

    if (!Number.isFinite(input.completionTime) || input.completionTime <= 0) {
      throw new Error('Temps de complétion invalide.');
    }

    const newStat: CompletedGameStat = {
      ...input,
      id: crypto.randomUUID(),
      completedAt: Date.now()
    };

    const nextStats = [newStat, ...PlayerStatsStorage.load()].slice(0, MAX_HISTORY_SIZE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStats));
    return newStat;
  }

  static getSummary(): PlayerStatsSummary {
    const games = PlayerStatsStorage.load();
    const times = games.map(game => game.completionTime);
    const errors = games.map(game => game.errorCount);
    const hints = games.map(game => game.hintsUsed);

    const byDifficulty = DIFFICULTIES.reduce<Record<Difficulty, DifficultySummary>>((acc, difficulty) => {
      acc[difficulty] = buildDifficultySummary(games.filter(game => game.difficulty === difficulty));
      return acc;
    }, {
      facile: emptyDifficultySummary(),
      moyen: emptyDifficultySummary(),
      difficile: emptyDifficultySummary(),
      expert: emptyDifficultySummary()
    });

    return {
      gamesCompleted: games.length,
      bestTime: times.length > 0 ? Math.min(...times) : null,
      averageTime: calculateAverage(times),
      averageErrors: calculateAverage(errors) ?? 0,
      averageHints: calculateAverage(hints) ?? 0,
      lastCompletedAt: games[0]?.completedAt ?? null,
      byDifficulty,
      recentGames: games.slice(0, 8)
    };
  }

  static clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
