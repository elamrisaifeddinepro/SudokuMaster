import type { SudokuGrid } from './types';

/**
 * Retourne un Set de clés "row-col" pour toutes les cases impliquées
 * dans un conflit (doublon) sur ligne / colonne / bloc 3x3.
 */
export function getConflictKeys(grid: SudokuGrid): Set<string> {
  const conflicts = new Set<string>();

  const key = (r: number, c: number) => `${r}-${c}`;

  // Lignes
  for (let r = 0; r < 9; r++) {
    const seen = new Map<number, number>(); // value -> first col
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c].value;
      if (!v) continue;

      if (seen.has(v)) {
        const c0 = seen.get(v)!;
        conflicts.add(key(r, c0));
        conflicts.add(key(r, c));
      } else {
        seen.set(v, c);
      }
    }
  }

  // Colonnes
  for (let c = 0; c < 9; c++) {
    const seen = new Map<number, number>(); // value -> first row
    for (let r = 0; r < 9; r++) {
      const v = grid[r][c].value;
      if (!v) continue;

      if (seen.has(v)) {
        const r0 = seen.get(v)!;
        conflicts.add(key(r0, c));
        conflicts.add(key(r, c));
      } else {
        seen.set(v, r);
      }
    }
  }

  // Blocs 3x3
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const seen = new Map<number, { r: number; c: number }>();
      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          const r = br * 3 + dr;
          const c = bc * 3 + dc;
          const v = grid[r][c].value;
          if (!v) continue;

          if (seen.has(v)) {
            const first = seen.get(v)!;
            conflicts.add(key(first.r, first.c));
            conflicts.add(key(r, c));
          } else {
            seen.set(v, { r, c });
          }
        }
      }
    }
  }

  return conflicts;
}