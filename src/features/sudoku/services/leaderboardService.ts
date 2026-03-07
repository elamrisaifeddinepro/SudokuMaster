import { supabase } from '@/shared/api/supabaseClient';

export interface LeaderboardEntry {
  id?: number;
  player_name: string;
  difficulty: string;
  completion_time: number;
  error_count: number;
  created_at?: string;
}

export class LeaderboardService {
  static async addScore(
    entry: Omit<LeaderboardEntry, 'id' | 'created_at'>
  ): Promise<LeaderboardEntry | null> {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .insert([entry])
        .select()
        .single();

      if (error) {
        console.error('Error adding score:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error adding score:', error);
      return null;
    }
  }

  static async getTopScores(difficulty: string, limit = 10): Promise<LeaderboardEntry[]> {
    try {
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
