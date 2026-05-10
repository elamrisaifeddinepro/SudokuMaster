# Sudoku Master

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Leaderboard-3ECF8E?logo=supabase&logoColor=white)

**Sudoku Master** est une application web moderne de Sudoku développée avec **React**, **TypeScript**, **Vite**, **Tailwind CSS** et **Supabase**.

Le projet propose une expérience de jeu complète avec génération de grilles à solution unique, validation en temps réel, système d’indices intelligents, undo/redo, sauvegarde automatique, statistiques locales, leaderboard Supabase optionnel et interface bilingue **FR / EN**.

---

## Aperçu

> Captures de l’application à ajouter après le lancement local ou le déploiement.

---

## Fonctionnalités principales

### Gameplay

- Grille Sudoku 9×9 interactive
- 4 niveaux de difficulté : facile, moyen, difficile et expert
- Génération de grilles avec vérification d’unicité de la solution
- Validation en temps réel
- Pause avec masquage de la grille
- Undo / Redo basé sur le **Command Pattern**
- Confirmation avant abandon d’une partie
- Export / import d’une partie au format JSON

### Notation

- Mode valeur
- Notes en coins
- Notes au centre
- Marquage par couleur

### Système d’indices

- Singleton nu
- Singleton caché
- Élimination
- Paire nue
- Paires pointantes
- Blocage des indices lorsque la grille contient une erreur

### Statistiques & leaderboard

- Dashboard local du joueur
- Nombre de parties jouées
- Meilleur temps
- Temps moyen
- Taux d’erreurs
- Leaderboard en ligne via Supabase

### Navigation clavier

- Déplacement avec les flèches
- Sélection étendue avec Shift + flèches
- Sélection multiple avec Ctrl + clic
- Saisie avec les touches 1 à 9
- Suppression avec Suppr / Backspace
- Pause avec la touche P
- Fermeture / annulation avec Échap

---

## Stack technique

| Domaine | Technologies |
|---|---|
| Frontend | React 18, TypeScript |
| Build | Vite |
| Styles | Tailwind CSS |
| Icônes | Lucide React |
| Tests | Vitest |
| Backend léger | Supabase |
| Stockage local | localStorage |
| CI/CD | GitHub Actions |
| Internationalisation | FR / EN |

---

## Installation

Cloner le projet :

```bash
git clone https://github.com/elamrisaifeddinepro/SudokuMaster.git
cd SudokuMaster
```

Installer les dépendances :

```bash
npm install
```

Copier le fichier d’environnement :

```bash
cp .env.example .env
```

> Sans clés Supabase, le jeu fonctionne normalement en local. Seul le leaderboard en ligne est désactivé.

Lancer le serveur de développement :

```bash
npm run dev
```

Application disponible par défaut sur :

```bash
http://localhost:5173
```

---

## Scripts disponibles

```bash
npm run dev          # Lance le serveur de développement
npm run build        # Génère le build de production dans dist/
npm run preview      # Prévisualise le build de production
npm run test         # Lance les tests unitaires
npm run test:watch   # Lance les tests en mode watch
npm run lint         # Analyse le code avec ESLint
npm run typecheck    # Vérifie les types TypeScript
npm run ci           # Lance typecheck + tests + lint + build
```

---

## Tests

Lancer les tests unitaires :

```bash
npm run test
```

Les tests couvrent notamment :

- La génération des grilles
- Le validateur Sudoku
- Le système undo / redo
- Le stockage local des statistiques

---

## Structure du projet

```text
src/
├── app/
│   ├── App.tsx
│   └── styles/
│       └── index.css
├── features/
│   └── sudoku/
│       ├── hooks/          # useSudokuGame, useGameTimer
│       ├── model/          # generator, validator, hintSystem, commands, types
│       ├── services/       # localStorage, fileManager, leaderboard, stats
│       └── ui/             # composants, panels, modals
└── shared/
    ├── api/                # supabaseClient
    └── i18n/               # traductions FR / EN
```

---

## Supabase

Supabase est utilisé pour gérer le leaderboard en ligne. Cette intégration est optionnelle : le jeu reste entièrement jouable sans configuration Supabase.

### Configuration

1. Créer un projet sur [Supabase](https://supabase.com)
2. Copier le `Project URL` et la `anon key`
3. Les ajouter dans le fichier `.env`
4. Exécuter la migration SQL suivante dans le SQL Editor Supabase :

```text
supabase/migrations/20251114032954_spring_prism.sql
```

La migration crée la table `leaderboard` avec **RLS activé**.

### Sécurité

La configuration actuelle permet :

- Lecture publique du leaderboard
- Insertion publique de scores
- Modification et suppression interdites côté client

Une évolution prévue consiste à ajouter une **Supabase Edge Function** afin de valider les scores côté serveur avant insertion.

---


## Évolutions prévues

Les prochaines améliorations envisagées sont :

- Mode défi à deux joueurs
- Duel en temps réel sur la même grille
- Classement basé sur le temps, les erreurs et les indices utilisés
- Profil joueur
- Historique des parties
- Statistiques avancées
- Mode tournoi
- Tests d’intégration avec React Testing Library
- Tests end-to-end avec Playwright
- Validation serveur des scores avec Supabase Edge Function

---

## Objectif du projet

Ce projet a été conçu comme un projet portfolio afin de démontrer :

- La maîtrise de React et TypeScript
- La structuration d’une application frontend moderne
- La gestion d’une logique métier complexe
- L’utilisation de patterns comme le Command Pattern
- L’intégration de tests automatisés
- L’utilisation d’un backend léger avec Supabase
- La préparation d’un projet maintenable et évolutif

---

## Auteur

**El Amri Saifeddine**  
Développeur Full-Stack  
Étudiant en informatique à l’UQTR  

GitHub : [elamrisaifeddinepro](https://github.com/elamrisaifeddinepro)  
LinkedIn : [El Amri Saifeddine](https://www.linkedin.com/in/el-amri-saifeddine-22355225b/)

---

## Licence

Projet réalisé à des fins de portfolio, d’apprentissage et de démonstration technique.
