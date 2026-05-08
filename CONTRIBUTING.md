# Contribution — Sudoku Master

Ce projet est principalement un projet portfolio, mais il peut être amélioré proprement avec ce flux de travail.

## Installation

```bash
npm install
npm run dev
```

## Avant de proposer une modification

Lancer :

```bash
npm run ci
```

Cette commande exécute :

- TypeScript typecheck ;
- tests unitaires ;
- ESLint ;
- build production.

## Convention de branches suggérée

```text
feature/nom-fonctionnalite
fix/description-du-bug
docs/mise-a-jour-readme
refactor/description
```

## Style de code

- Garder TypeScript strict.
- Éviter `any`.
- Garder les fonctions métier testables.
- Ajouter ou mettre à jour les tests quand la logique Sudoku change.
- Ne jamais commiter `.env` ou des clés Supabase réelles.
