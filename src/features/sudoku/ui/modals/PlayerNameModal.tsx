import React, { useState } from 'react'
import { User, Trophy, Save } from 'lucide-react'

interface PlayerNameModalProps {
  isOpen: boolean
  difficulty: string
  completionTime: number
  errorCount: number
  onSave: (playerName: string) => void
  onSkip: () => void
}

const difficultyEmojis: Record<string, string> = {
  facile: '🟢',
  moyen: '🟡',
  difficile: '🟠',
  expert: '🔴'
}

export const PlayerNameModal: React.FC<PlayerNameModalProps> = ({
  isOpen,
  difficulty,
  completionTime,
  errorCount,
  onSave,
  onSkip
}) => {
  const [playerName, setPlayerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`
    }
    return `${secs}s`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim()) return

    setIsSubmitting(true)
    try {
      await onSave(playerName.trim())
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="app-surface rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/15 border border-amber-400/40 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-amber-200" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Excellent score ! 🎉
          </h2>
          <p className="text-slate-300">
            Enregistrez votre score dans le tableau d'honneur
          </p>
        </div>

        {/* Score summary */}
        <div className="bg-slate-950/30 border border-slate-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300">Difficulté :</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">{difficultyEmojis[difficulty]}</span>
              <span className="font-semibold capitalize">{difficulty}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300">Temps :</span>
            <span className="font-bold text-cyan-200">{formatTime(completionTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Erreurs :</span>
            <span className="font-bold text-rose-200">
              {errorCount} erreur{errorCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Name input form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-slate-200 mb-2">
              Votre nom (pour le tableau d'honneur) :
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Entrez votre nom..."
                maxLength={50}
                className="w-full pl-10 pr-4 py-3 border border-slate-700 bg-slate-950/30 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                autoFocus
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Maximum 50 caractères
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!playerName.trim() || isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:bg-slate-800 text-cyan-100 border border-cyan-400/40 glow-cyan rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer le score'}
            </button>
            
            <button
              type="button"
              onClick={onSkip}
              disabled={isSubmitting}
              className="px-4 py-3 bg-slate-950/30 hover:bg-slate-900/60 disabled:bg-slate-900/30 text-slate-200 border border-slate-700 rounded-lg font-medium transition-colors"
            >
              Passer
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-400 text-center mt-4">
          📋 Nécessite Supabase configuré. Cliquez ⚙️ → "Supabase" pour configurer.
        </p>
      </div>
    </div>
  )
}