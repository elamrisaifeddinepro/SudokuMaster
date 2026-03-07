/*
  # Création de la table leaderboard pour le tableau d'honneur

  1. Nouvelle table
    - `leaderboard`
      - `id` (serial, clé primaire)
      - `player_name` (varchar, nom du joueur)
      - `difficulty` (varchar, niveau de difficulté)
      - `completion_time` (integer, temps en secondes)
      - `error_count` (integer, nombre d'erreurs)
      - `created_at` (timestamp, date de création)

  2. Sécurité
    - Activer RLS sur la table `leaderboard`
    - Politique pour permettre la lecture publique
    - Politique pour permettre l'insertion publique

  3. Index
    - Index sur la difficulté pour optimiser les requêtes
    - Index sur le temps de completion pour le classement
*/

-- Créer la table leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  completion_time INTEGER NOT NULL,
  error_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous
CREATE POLICY "Allow public read access" 
  ON leaderboard 
  FOR SELECT 
  USING (true);

-- Politique pour permettre l'insertion à tous
CREATE POLICY "Allow public insert access" 
  ON leaderboard 
  FOR INSERT 
  WITH CHECK (true);

-- Index pour optimiser les requêtes de classement
CREATE INDEX IF NOT EXISTS idx_leaderboard_difficulty 
  ON leaderboard(difficulty);

CREATE INDEX IF NOT EXISTS idx_leaderboard_ranking 
  ON leaderboard(difficulty, completion_time, error_count);

-- Index pour les requêtes par date
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at 
  ON leaderboard(created_at DESC);