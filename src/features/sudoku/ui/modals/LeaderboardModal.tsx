import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Award, X, RefreshCw, Filter } from 'lucide-react'
import { LeaderboardService, LeaderboardEntry } from '@/features/sudoku/services/leaderboardService'

interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose
}) => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const difficulties = [
    { key: 'all', label: 'Tous les niveaux', emoji: '🏆' },
    { key: 'facile', label: 'Facile', emoji: '🟢' },
    { key: 'moyen', label: 'Moyen', emoji: '🟡' },
    { key: 'difficile', label: 'Difficile', emoji: '🟠' },
    { key: 'expert', label: 'Expert', emoji: '🔴' }
  ]

  const loadScores = async () => {
    setLoading(true)
    try {
      console.log('Loading scores for difficulty:', selectedDifficulty);
      let data: LeaderboardEntry[]
      if (selectedDifficulty === 'all') {
        data = await LeaderboardService.getAllTopScores(50)
      } else {
        data = await LeaderboardService.getTopScores(selectedDifficulty, 20)
      }
      console.log('Loaded scores:', data);
      setScores(data)
    } catch (error) {
      console.error('Error loading scores:', error)
      alert('Erreur lors du chargement des scores. Vérifiez votre connexion.');
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadScores()
    }
  }, [isOpen, selectedDifficulty])

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-500" />
      case 1: return <Medal className="w-6 h-6 text-slate-400" />
      case 2: return <Award className="w-6 h-6 text-amber-600" />
      default: return <span className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">{index + 1}</span>
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="app-surface rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 p-6 text-slate-100 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Tableau d'Honneur</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-950/40 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-300" />
              <span className="font-medium text-slate-200">Filtrer par difficulté :</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {difficulties.map(diff => (
                <button
                  key={diff.key}
                  onClick={() => setSelectedDifficulty(diff.key)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors font-medium
                    ${selectedDifficulty === diff.key
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100 glow-cyan'
                      : 'border-slate-700 hover:border-slate-600 text-slate-200 bg-slate-950/30 hover:bg-slate-900/60'
                    }
                  `}
                >
                  <span>{diff.emoji}</span>
                  <span className="text-sm">{diff.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={loadScores}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-950/30 hover:bg-slate-900/60 text-slate-200 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
              <span className="ml-3 text-slate-300">Chargement des scores...</span>
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 text-lg">Aucun score trouvé</p>
              <p className="text-slate-400 mb-2">
                {selectedDifficulty === 'all' 
                  ? 'Aucun score enregistré dans la base de données'
                  : `Aucun score pour le niveau ${selectedDifficulty}`
                }
              </p>
              <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                <p className="text-sm text-cyan-100 mb-3">
                  📋 Pour activer le tableau d'honneur, vous devez configurer Supabase :
                </p>
                <div className="space-y-2 text-xs text-cyan-200">
                  <p>1. Cliquez sur l'icône ⚙️ en haut de l'aperçu</p>
                  <p>2. Cliquez sur le bouton "Supabase"</p>
                  <p>3. Suivez les instructions pour créer votre projet</p>
                  <p>4. La table sera créée automatiquement</p>
                </div>
                <div className="mt-3 p-2 bg-amber-500/10 border border-amber-400/30 rounded text-xs text-amber-200">
                  ⚠️ Sans Supabase, les scores ne peuvent pas être sauvegardés
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {scores.map((entry, index) => (
                <div
                  key={entry.id || index}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border-2 transition-colors
                    ${index < 3 
                      ? 'border-amber-400/30 bg-amber-500/10' 
                      : 'border-slate-700 bg-slate-950/30'
                    }
                  `}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {getRankIcon(index)}
                  </div>

                  {/* Player name */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-100 truncate">
                      {entry.player_name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {entry.created_at && new Date(entry.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="flex-shrink-0">
                    <span className={`
                      inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                      ${LeaderboardService.getDifficultyColor(entry.difficulty)}
                    `}>
                      {LeaderboardService.getDifficultyEmoji(entry.difficulty)}
                      {entry.difficulty}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex-shrink-0 text-right">
                    <div className="font-bold text-slate-100">
                      {LeaderboardService.formatTime(entry.completion_time)}
                    </div>
                    <div className="text-sm text-slate-400">
                      {entry.error_count} erreur{entry.error_count > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-950/30">
          <div className="text-center text-sm text-slate-300">
            <p>🏆 Classement basé sur le temps de completion puis le nombre d'erreurs</p>
            <p className="mt-1">Terminez une partie pour apparaître dans le tableau d'honneur !</p>
          </div>
        </div>
      </div>
    </div>
  )
}