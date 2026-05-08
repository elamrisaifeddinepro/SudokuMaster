import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlayerStatsStorage } from './playerStatsStorage';

const storage = new Map<string, string>();

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    clear: vi.fn(() => storage.clear())
  },
  configurable: true
});

Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: vi.fn(() => 'test-id') },
  configurable: true
});

describe('PlayerStatsStorage', () => {
  beforeEach(() => {
    storage.clear();
    vi.clearAllMocks();
  });

  it('starts with an empty summary', () => {
    const summary = PlayerStatsStorage.getSummary();

    expect(summary.gamesCompleted).toBe(0);
    expect(summary.bestTime).toBeNull();
    expect(summary.recentGames).toHaveLength(0);
  });

  it('stores completed games and calculates global summary', () => {
    PlayerStatsStorage.addCompletedGame({
      difficulty: 'moyen',
      completionTime: 600,
      errorCount: 2,
      hintsUsed: 1
    });
    PlayerStatsStorage.addCompletedGame({
      difficulty: 'moyen',
      completionTime: 420,
      errorCount: 0,
      hintsUsed: 2
    });

    const summary = PlayerStatsStorage.getSummary();

    expect(summary.gamesCompleted).toBe(2);
    expect(summary.bestTime).toBe(420);
    expect(summary.averageTime).toBe(510);
    expect(summary.averageErrors).toBe(1);
    expect(summary.averageHints).toBe(1.5);
    expect(summary.byDifficulty.moyen.gamesCompleted).toBe(2);
    expect(summary.byDifficulty.facile.gamesCompleted).toBe(0);
  });

  it('can clear all local stats', () => {
    PlayerStatsStorage.addCompletedGame({
      difficulty: 'facile',
      completionTime: 300,
      errorCount: 0,
      hintsUsed: 0
    });

    PlayerStatsStorage.clear();

    expect(PlayerStatsStorage.getSummary().gamesCompleted).toBe(0);
  });
});
