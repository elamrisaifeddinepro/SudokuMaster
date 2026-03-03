export type LeaderboardEntry = {
  id: string;
  name: string;
  seconds: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  createdAt: string; // ISO
};

const STORAGE_KEY = 'sudoku_leaderboard_v1';

function readAll(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as LeaderboardEntry[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeAll(entries: LeaderboardEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addScore(entry: Omit<LeaderboardEntry, 'id' | 'createdAt'>) {
  const all = readAll();
  const full: LeaderboardEntry = {
    ...entry,
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
  };
  const next = [full, ...all];
  writeAll(next);
  return full;
}

export function getTopScores(limit = 10): LeaderboardEntry[] {
  const all = readAll();
  return all
    .slice()
    .sort((a, b) => a.seconds - b.seconds)
    .slice(0, limit);
}

export function clearScores() {
  writeAll([]);
}

export function formatTime(seconds: number) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const pad2 = (n: number) => n.toString().padStart(2, '0');
  return `${pad2(mm)}:${pad2(ss)}`;
}