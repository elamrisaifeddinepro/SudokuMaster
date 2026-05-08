# Sudoku Master

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)

Jeu de Sudoku en React / TypeScript. Génération de grilles avec solution unique, validation en temps réel, indices, undo/redo, sauvegarde automatique, statistiques, leaderboard Supabase et interface FR/EN.

---

## Aperçu

> *(captures à ajouter après lancement)*

---

## Fonctionnalités

**Gameplay**
- Grille 9×9 interactive, 4 niveaux de difficulté (facile → expert)
- Génération avec vérification d'unicité de la solution
- Validation en temps réel par comparaison avec la solution
- Pause avec masquage de la grille
- Undo / redo (Command Pattern)
- Confirmation avant abandon de partie
- Export / import JSON

**Notation**
- Mode valeur, coins, centre et couleur par cellule

**Indices**
- Singleton nu, singleton caché, élimination, paire nue, paires pointantes
- Indices bloqués si la grille contient une erreur

**Stats & leaderboard**
- Dashboard local : parties jouées, meilleur temps, temps moyen, taux d'erreurs
- Leaderboard en ligne via Supabase (optionnel)

**Navigation clavier complète**
- Flèches, Shift+flèches, Ctrl+clic, touches 1–9, Suppr, P (pause), Échap

---

## Stack

| | |
|---|---|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Styles | Tailwind CSS |
| Icônes | Lucide React |
| Tests | Vitest |
| Backend | Supabase (optionnel) |
| CI | GitHub Actions |

---

## Installation

```bash
git clone https://github.com/elamrisaifeddinepro/SudokuMaster.git
cd SudokuMaster
npm install
```

Copier le fichier d'environnement :

```bash
cp .env.example .env
```

Sans clés Supabase, le jeu tourne normalement en local. Seul le leaderboard en ligne est désactivé.

Lancer :

```bash
npm run dev
# http://localhost:5173
```

---

## Scripts

```bash
npm run dev          # serveur de développement
npm run build        # build production → dist/
npm run preview      # prévisualiser le build
npm run test         # tests unitaires
npm run test:watch   # tests en mode watch
npm run lint         # ESLint
npm run typecheck    # vérification TypeScript
npm run ci           # typecheck + test + lint + build
```

---

## Tests

```bash
npm run test
```

Couvrent : génération de grilles, validateur, undo/redo, stockage des stats.

---

## Structure

```
src/
├── app/
│   ├── App.tsx
│   └── styles/index.css
├── features/
│   └── sudoku/
│       ├── hooks/          # useSudokuGame, useGameTimer
│       ├── model/          # generator, validator, hintSystem, commands, types
│       ├── services/       # localStorage, fileManager, leaderboard, stats
│       └── ui/             # composants, panels, modals
└── shared/
    ├── api/                # supabaseClient
    └── i18n/               # traductions FR/EN
```

---

## Supabase (optionnel)

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier `Project URL` et `anon key` dans `.env`
3. Exécuter la migration dans le SQL Editor :

```
supabase/migrations/20251114032954_spring_prism.sql
```

La table `leaderboard` est créée avec RLS activé — lecture et insertion publiques, pas de modification ni suppression.

---

## Déploiement

```bash
npm run build
# déployer le dossier dist/
```

Compatible Vercel, Netlify, GitHub Pages. Voir `docs/DEPLOYMENT.md` pour la configuration détaillée.

---

## Licence

Usage libre pour portfolio et apprentissage.
