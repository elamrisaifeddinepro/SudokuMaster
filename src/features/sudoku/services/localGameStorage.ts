import { GridState, NotationMode } from '@/features/sudoku/model/types';
import { FileManager } from '@/features/sudoku/services/fileManager';

export interface LocalGameSave {
  readonly version: string;
  readonly savedAt: number;
  readonly gridState: GridState;
  readonly currentDifficulty: string;
  readonly notationMode: NotationMode;
  readonly errorCount: number;
  readonly hintsUsed: number;
  readonly seconds: number;
}

export class LocalGameStorage {
  private static readonly KEY = 'sudoku-master:auto-save';
  private static readonly VERSION = '1.0.0';

  static save(data: Omit<LocalGameSave, 'version' | 'savedAt'>): void {
    if (!this.canUseStorage()) return;

    const payload: LocalGameSave = {
      version: this.VERSION,
      savedAt: Date.now(),
      ...data
    };

    localStorage.setItem(this.KEY, JSON.stringify(payload));
  }

  static load(): LocalGameSave | null {
    if (!this.canUseStorage()) return null;

    const raw = localStorage.getItem(this.KEY);
    if (!raw) return null;

    try {
      const parsed: unknown = JSON.parse(raw);
      if (!this.isValidSave(parsed)) {
        this.clear();
        return null;
      }

      return parsed;
    } catch {
      this.clear();
      return null;
    }
  }

  static clear(): void {
    if (!this.canUseStorage()) return;
    localStorage.removeItem(this.KEY);
  }

  static hasSave(): boolean {
    return this.load() !== null;
  }

  private static canUseStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private static isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private static isValidSave(value: unknown): value is LocalGameSave {
    if (!this.isRecord(value)) return false;

    const gridState = value.gridState;
    if (!this.isRecord(gridState)) return false;

    const filePayload = JSON.stringify({
      version: '1.0.0',
      grid: gridState.grid,
      solution: gridState.solution,
      timestamp: value.savedAt
    });

    try {
      FileManager.loadGame(filePayload);
    } catch {
      return false;
    }

    return (
      typeof value.version === 'string' &&
      typeof value.savedAt === 'number' &&
      typeof value.currentDifficulty === 'string' &&
      ['value', 'corner', 'center', 'color'].includes(String(value.notationMode)) &&
      typeof value.errorCount === 'number' &&
      value.errorCount >= 0 &&
      typeof value.hintsUsed === 'number' &&
      value.hintsUsed >= 0 &&
      typeof value.seconds === 'number' &&
      value.seconds >= 0 &&
      Array.isArray(gridState.selectedCells) &&
      Array.isArray(gridState.errors)
    );
  }
}
