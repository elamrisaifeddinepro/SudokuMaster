const KEY = 'sudoku_last_player_name_v1';

export function getLastPlayerName(): string {
  try {
    return localStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

export function setLastPlayerName(name: string) {
  try {
    localStorage.setItem(KEY, name);
  } catch {
    // ignore
  }
}