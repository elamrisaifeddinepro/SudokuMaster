import type { SudokuGrid } from '@/features/sudoku/model/types';

export type SavedGame = {
  version: 1;
  savedAt: string; // ISO
  grid: SudokuGrid;
  mode: 'value' | 'corner' | 'center';
  timerSeconds: number;
};

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export async function pickJsonFile(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);

      const text = await file.text();
      resolve(text);
    };

    input.click();
  });
}

export function parseSavedGame(raw: string): SavedGame {
  const obj = JSON.parse(raw) as Partial<SavedGame>;

  if (obj.version !== 1) throw new Error('Unsupported save version');
  if (!obj.grid || !Array.isArray(obj.grid) || obj.grid.length !== 9) throw new Error('Invalid grid');
  if (typeof obj.timerSeconds !== 'number') throw new Error('Invalid timerSeconds');
  if (obj.mode !== 'value' && obj.mode !== 'corner' && obj.mode !== 'center') throw new Error('Invalid mode');

  return obj as SavedGame;
}