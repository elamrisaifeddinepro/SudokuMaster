import { supabase, isSupabaseConfigured } from '@/shared/api/supabaseClient';
import { addScore as addLocal, getTopScores as getLocal, type LeaderboardEntry } from './leaderboardLocal';

const TABLE = 'leaderboard'; // table Supabase

export async function addScore(entry: Omit<LeaderboardEntry, 'id' | 'createdAt'>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    addLocal(entry);
    return;
  }

  const { error } = await supabase.from(TABLE).insert({
    player_name: entry.name,
    seconds: entry.seconds,
    difficulty: entry.difficulty,
  });

  if (error) {
    // fallback local si Supabase échoue
    addLocal(entry);
  }
}

export async function getTopScores(limit = 10): Promise<LeaderboardEntry[]> {
  if (!isSupabaseConfigured || !supabase) {
    return getLocal(limit);
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, player_name, seconds, difficulty, created_at')
    .order('seconds', { ascending: true })
    .limit(limit);

  if (error || !data) return getLocal(limit);

  return data.map((r) => ({
    id: String(r.id),
    name: String(r.player_name),
    seconds: Number(r.seconds),
    difficulty: r.difficulty as LeaderboardEntry['difficulty'],
    createdAt: String(r.created_at),
  }));
}