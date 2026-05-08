# Sudoku Master

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)

**Sudoku Master** est une application web Sudoku moderne développée avec **React**, **TypeScript**, **Vite**, **Tailwind CSS** et **Supabase**.

Le projet propose une expérience complète : génération de grilles avec solution unique, validation en temps réel, système d'indices, undo/redo, pause, sauvegarde locale automatique, export/import JSON, statistiques joueur, leaderboard Supabase et interface bilingue FR/EN.

---

## Objectif portfolio

Ce projet a été préparé pour être présenté dans un portfolio GitHub. Il démontre :

- une architecture React/TypeScript modulaire ;
- une logique métier Sudoku avancée ;
- une génération de puzzles avec vérification d'unicité ;
- une interface responsive avec design premium ;
- une navigation clavier et des attributs d'accessibilité ;
- une intégration Supabase pour le leaderboard ;
- une sauvegarde locale avec `localStorage` ;
- un dashboard de statistiques locales ;
- une internationalisation FR/EN ;
- une suite de tests unitaires avec Vitest ;
- une configuration CI GitHub Actions prête à l'emploi.

---

## Aperçu

> Ajoute ici tes captures après exécution du projet.

```text
public/screenshots/
├── home.png
├── game.png
├── stats-dashboard.png
└── victory.png
```

Exemples de captures recommandées :

| Capture | Contenu conseillé |
|---|---|
| `home.png` | Vue principale du jeu |
| `game.png` | Grille en cours avec notes/couleurs |
| `stats-dashboard.png` | Modal statistiques joueur |
| `victory.png` | Écran de victoire premium |

---

## Fonctionnalités principales

### Gameplay

- Grille Sudoku 9x9 interactive.
- Génération de puzzles avec solution unique.
- Difficultés : facile, moyen, difficile, expert.
- Chiffres donnés protégés contre la modification.
- Validation des erreurs par comparaison avec la solution officielle.
- Détection automatique de fin de partie.
- Pause/reprise avec masquage de la grille.
- Confirmation avant nouvelle grille.
- Undo/redo avec Command Pattern.
- Export/import JSON.
- Sauvegarde locale automatique après modification.

### Modes de notation

- **Valeur** : saisie définitive.
- **Coins** : petites notes de coin.
- **Centre** : notes centrales.
- **Couleur** : marquage visuel des cellules.

### Système d'indices

- Singleton nu.
- Singleton caché.
- Élimination simple.
- Paire nue.
- Paires/triples pointantes quand une vraie élimination est possible.
- Blocage des indices si la grille contient une erreur.

### Statistiques locales

Le dashboard joueur affiche :

- nombre de parties complétées ;
- meilleur temps ;
- temps moyen ;
- erreurs moyennes ;
- indices moyens ;
- performance par difficulté ;
- progression récente.

Les statistiques sont stockées localement dans le navigateur.

### Leaderboard Supabase

Le projet inclut une migration SQL pour créer une table `leaderboard` avec :

- politiques RLS ;
- lecture publique ;
- insertion publique limitée ;
- contraintes sur nom, difficulté, temps et erreurs.

> Pour une vraie mise en production publique, il est recommandé d'ajouter une validation serveur ou une Supabase Edge Function afin de limiter les scores falsifiés.

### Internationalisation

L'interface inclut un sélecteur **FR / EN**. La préférence est conservée dans `localStorage`.

---

## Stack technique

| Catégorie | Technologie |
|---|---|
| Frontend | React 18 |
| Langage | TypeScript |
| Build | Vite |
| UI | Tailwind CSS |
| Icônes | Lucide React |
| Backend-as-a-Service | Supabase |
| Tests | Vitest |
| Qualité | ESLint + TypeScript strict |
| CI | GitHub Actions |

---

## Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/<username>/sudoku-master.git
cd sudoku-master
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à partir de l'exemple :

```bash
cp .env.example .env
```

Puis compléter :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Sans configuration Supabase valide, le jeu reste utilisable localement. Seul le leaderboard en ligne sera désactivé.

### 4. Lancer l'application

```bash
npm run dev
```

URL locale par défaut :

```text
http://localhost:5173
```

---

## Scripts disponibles

```bash
npm run dev        # Lance le serveur de développement
npm run build      # Génère le build de production dans dist/
npm run preview    # Prévisualise localement le build de production
npm run lint       # Lance ESLint
npm run typecheck  # Vérifie TypeScript sans générer de fichiers
npm run test       # Exécute les tests unitaires Vitest
npm run test:watch # Lance les tests en mode watch
npm run ci         # Lance typecheck + tests + lint + build
```

Commande recommandée avant chaque push :

```bash
npm run ci
```

---

## Qualité et tests

La base actuelle est validée par :

```bash
npm run typecheck
npm run test
npm run lint
npm run build
```

Les tests couvrent notamment :

- génération Sudoku ;
- cohérence puzzle/solution ;
- validation des doublons ;
- protection des cases données ;
- commandes undo/redo ;
- statistiques locales.

---

## CI GitHub Actions

Le projet contient un workflow :

```text
.github/workflows/ci.yml
```

Il s'exécute sur `push` et `pull_request` vers `main` et lance :

```bash
npm ci
npm run typecheck
npm run test
npm run lint
npm run build
```

---

## Structure du projet

```text
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── DEPLOYMENT.md
├── public/
│   ├── favicon.svg
│   └── screenshots/
│       └── .gitkeep
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── styles/
│   │       └── index.css
│   ├── features/
│   │   └── sudoku/
│   │       ├── hooks/
│   │       ├── model/
│   │       ├── services/
│   │       └── ui/
│   ├── shared/
│   │   ├── api/
│   │   └── i18n/
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
│   └── migrations/
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
├── README.md
├── package.json
└── vite.config.ts
```

---

## Rôle des fichiers importants

| Fichier | Rôle |
|---|---|
| `src/app/App.tsx` | Assemble l'interface principale |
| `src/features/sudoku/hooks/useSudokuGame.ts` | Logique centrale du jeu |
| `src/features/sudoku/model/sudokuGenerator.ts` | Génération de puzzles avec solution unique |
| `src/features/sudoku/model/sudokuValidator.ts` | Validation des règles Sudoku |
| `src/features/sudoku/model/hintSystem.ts` | Système d'indices |
| `src/features/sudoku/model/commands/sudokuCommands.ts` | Command Pattern pour undo/redo |
| `src/features/sudoku/services/localGameStorage.ts` | Sauvegarde locale automatique |
| `src/features/sudoku/services/playerStatsStorage.ts` | Statistiques locales du joueur |
| `src/features/sudoku/services/leaderboardService.ts` | Communication Supabase leaderboard |
| `src/shared/i18n/i18n.tsx` | Internationalisation FR/EN |
| `supabase/migrations/...sql` | Migration SQL leaderboard |

---

## Contrôles utilisateur

| Action | Contrôle |
|---|---|
| Sélectionner une cellule | Clic |
| Sélection multiple | Ctrl + clic ou Cmd + clic |
| Déplacement clavier | Flèches |
| Étendre la sélection | Shift + flèches |
| Saisir un chiffre | 1 à 9 |
| Effacer | Suppr ou Backspace |
| Désélectionner | Échap |
| Pause/Reprendre | Touche P ou bouton Pause |
| Exporter | Bouton Sauvegarder |
| Importer | Bouton Charger |
| Voir les statistiques | Bouton Statistiques |

---

## Supabase

La migration se trouve dans :

```text
supabase/migrations/20251114032954_spring_prism.sql
```

Pour l'utiliser :

1. Créer un projet Supabase.
2. Copier les valeurs `Project URL` et `anon public key` dans `.env`.
3. Exécuter la migration SQL dans Supabase SQL Editor ou via Supabase CLI.
4. Relancer l'application.

---

## Déploiement

Voir le guide dédié :

```text
docs/DEPLOYMENT.md
```

Résumé pour un hébergement statique :

```bash
npm run build
```

Le dossier généré est :

```text
dist/
```

---

## Améliorations futures possibles

- Ajouter des tests d'intégration React avec React Testing Library.
- Ajouter des tests E2E avec Playwright.
- Séparer davantage `useSudokuGame.ts` en hooks spécialisés.
- Ajouter une Supabase Edge Function pour sécuriser les scores.
- Ajouter une authentification facultative.
- Synchroniser les statistiques locales avec un profil joueur.

---

## Licence

Projet éducatif et portfolio. Choisir une licence avant publication publique si nécessaire.
