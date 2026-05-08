/*
  # Création sécurisée de la table leaderboard

  1. Table
    - `leaderboard`
      - `id` : clé primaire
      - `player_name` : nom du joueur, 1 à 50 caractères utiles
      - `difficulty` : facile, moyen, difficile ou expert
      - `completion_time` : temps en secondes, entre 1 seconde et 24 heures
      - `error_count` : nombre d'erreurs, entre 0 et 100
      - `created_at` : date de création

  2. Sécurité
    - RLS activé
    - Lecture publique autorisée
    - Insertion publique autorisée seulement si les données respectent les règles
    - Aucun update/delete public

  3. Index
    - Classement par difficulté, temps, erreurs et date
*/

CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  completion_time INTEGER NOT NULL,
  error_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'leaderboard_player_name_valid'
  ) THEN
    ALTER TABLE leaderboard
      ADD CONSTRAINT leaderboard_player_name_valid
      CHECK (char_length(btrim(player_name)) BETWEEN 1 AND 50);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'leaderboard_difficulty_valid'
  ) THEN
    ALTER TABLE leaderboard
      ADD CONSTRAINT leaderboard_difficulty_valid
      CHECK (difficulty IN ('facile', 'moyen', 'difficile', 'expert'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'leaderboard_completion_time_valid'
  ) THEN
    ALTER TABLE leaderboard
      ADD CONSTRAINT leaderboard_completion_time_valid
      CHECK (completion_time BETWEEN 1 AND 86400);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'leaderboard_error_count_valid'
  ) THEN
    ALTER TABLE leaderboard
      ADD CONSTRAINT leaderboard_error_count_valid
      CHECK (error_count BETWEEN 0 AND 100);
  END IF;
END $$;

DROP POLICY IF EXISTS "Allow public read access" ON leaderboard;
DROP POLICY IF EXISTS "Allow public insert access" ON leaderboard;

CREATE POLICY "Allow public read access"
  ON leaderboard
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON leaderboard
  FOR INSERT
  WITH CHECK (
    char_length(btrim(player_name)) BETWEEN 1 AND 50
    AND difficulty IN ('facile', 'moyen', 'difficile', 'expert')
    AND completion_time BETWEEN 1 AND 86400
    AND error_count BETWEEN 0 AND 100
  );

CREATE INDEX IF NOT EXISTS idx_leaderboard_difficulty
  ON leaderboard(difficulty);

CREATE INDEX IF NOT EXISTS idx_leaderboard_ranking
  ON leaderboard(difficulty, completion_time ASC, error_count ASC, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at
  ON leaderboard(created_at DESC);
