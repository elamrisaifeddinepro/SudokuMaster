import { isSupabaseConfigured, supabase } from '@/shared/api/supabaseClient';

export type Difficulty = 'facile' | 'moyen' | 'difficile' | 'expert';

export interface LeaderboardEntry {
  id?: number;
  player_name: string;
  difficulty: Difficulty;
  completion_time: number;
  error_count: number;
  created_at?: string;
}

type NewLeaderboardEntry = {
  player_name: string;
  difficulty: string;
  completion_time: number;
  error_count: number;
};

const ALLOWED_DIFFICULTIES: readonly Difficulty[] = ['facile', 'moyen', 'difficile', 'expert'];
const MAX_PLAYER_NAME_LENGTH = 50;
const MAX_COMPLETION_TIME_SECONDS = 24 * 60 * 60;
const MAX_ERROR_COUNT = 100;

const sanitizePlayerName = (playerName: string): string =>
  [...playerName]
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join('')
    .trim()
    .slice(0, MAX_PLAYER_NAME_LENGTH);

const isDifficulty = (difficulty: string): difficulty is Difficulty =>
  ALLOWED_DIFFICULTIES.includes(difficulty as Difficulty);

const validateScore = (entry: NewLeaderboardEntry): NewLeaderboardEntry => {
  const playerName = sanitizePlayerName(entry.player_name);

  if (!playerName) {
    throw new Error('Le nom du joueur est obligatoire.');
  }

  if (!isDifficulty(entry.difficulty)) {
    throw new Error('La difficulté du score est invalide.');
  }

  if (!Number.isInteger(entry.completion_time) || entry.completion_time < 1 || entry.completion_time > MAX_COMPLETION_TIME_SECONDS) {
    throw new Error('Le temps de complétion est invalide.');
  }

  if (!Number.isInteger(entry.error_count) || entry.error_count < 0 || entry.error_count > MAX_ERROR_COUNT) {
    throw new Error('Le nombre d’erreurs est invalide.');
  }

  return {
    player_name: playerName,
    difficulty: entry.difficulty,
    completion_time: entry.completion_time,
    error_count: entry.error_count,
  };
};

export class LeaderboardService {
  static async addScore(entry: NewLeaderboardEntry): Promise<LeaderboardEntry> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase n’est pas configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.');
    }

    const validatedEntry = validateScore(entry);

    const { data, error } = await supabase
      .from('leaderboard')
      .insert([validatedEntry])
      .select()
      .single();

    if (error) {
      console.error('Error adding score:', error);
      throw new Error('Le score n’a pas pu être sauvegardé dans Supabase.');
    }

    if (!data) {
      throw new Error('Supabase n’a retourné aucun score sauvegardé.');
    }

    return data;
  }

  static async getTopScores(difficulty: Difficulty | string, limit = 10): Promise<LeaderboardEntry[]> {
    try {
      if (!isSupabaseConfigured || !isDifficulty(difficulty)) {
        return [];
      }

      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('difficulty', difficulty)
        .order('completion_time', { ascending: true })
        .order('error_count', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching scores:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching scores:', error);
      return [];
    }
  }

  static async getAllTopScores(limit = 50): Promise<LeaderboardEntry[]> {
    try {
      if (!isSupabaseConfigured) {
        return [];
      }

      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('completion_time', { ascending: true })
        .order('error_count', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching all scores:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching all scores:', error);
      return [];
    }
  }

  static formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  }

  static getDifficultyEmoji(difficulty: string): string {
    const emojis: Record<string, string> = {
      facile: '🟢',
      moyen: '🟡',
      difficile: '🟠',
      expert: '🔴',
    };
    return emojis[difficulty] || '⚪';
  }

  static getDifficultyColor(difficulty: string): string {
    const colors: Record<string, string> = {
      facile: 'text-emerald-200 bg-emerald-500/12 border border-emerald-400/30',
      moyen: 'text-cyan-100 bg-cyan-500/12 border border-cyan-400/30',
      difficile: 'text-amber-200 bg-amber-500/12 border border-amber-400/30',
      expert: 'text-rose-200 bg-rose-500/12 border border-rose-400/30',
    };
    return colors[difficulty] || 'text-slate-200 bg-slate-950/30 border border-slate-700';
  }
}
