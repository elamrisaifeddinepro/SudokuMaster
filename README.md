# Sudoku Master - Application Web Complète

Une application Sudoku moderne et complète développée en React/TypeScript avec toutes les fonctionnalités avancées d'un solveur professionnel.


## 🎯 Vue d'ensemble

Sudoku Master est une application web sophistiquée qui combine gameplay intuitif, techniques de résolution avancées, et fonctionnalités sociales. Développée selon les principes SOLID et utilisant des patterns GoF, elle offre une expérience utilisateur exceptionnelle.

## ✨ Fonctionnalités principales

### 🎮 **Gameplay Core**
- **Grille 9x9 interactive** avec séparation visuelle des boîtes 3x3
- **Sélection multiple** de cellules (Ctrl+Clic, double-clic)
- **Validation en temps réel** avec surlignage des erreurs
- **4 modes de notation** : Valeur, Coins, Centre, Couleur
- **Contrôles clavier** complets (1-9, Suppr, Échap)

### 🎨 **Système de notation avancé**
- **Valeurs principales** : Chiffres de 1 à 9
- **Notes de coins** : Maximum 4 chiffres par cellule
- **Notes de centre** : Chiffres multiples au centre
- **Couleurs** : 9 couleurs différentes pour organiser visuellement

### 🎯 **Niveaux de difficulté**
- **🟢 Facile** : 46 chiffres donnés, 10 erreurs max, 8 indices
- **🟡 Moyen** : 36 chiffres donnés, 8 erreurs max, 6 indices  
- **🟠 Difficile** : 26 chiffres donnés, 6 erreurs max, 4 indices
- **🔴 Expert** : 16 chiffres donnés, 4 erreurs max, 2 indices

### 💡 **Système d'indices intelligent**
- **🤖 Mode automatique** : Sélection intelligente de la meilleure technique
- **🎯 Singleton nu** : Cellules avec une seule valeur possible
- **👁️ Singleton caché** : Valeurs qui ne peuvent aller qu'à un endroit
- **🚫 Élimination** : Identification des valeurs impossibles
- **⚡ Techniques avancées** : Paires pointantes, réductions boîte/ligne

### ⏱️ **Gestion du temps et erreurs**
- **Chronomètre** avec pause automatique
- **Compteur d'erreurs** avec limite par difficulté
- **Game Over** automatique si trop d'erreurs
- **Statistiques** de performance détaillées

### 🏆 **Tableau d'honneur (Supabase)**
- **Classement mondial** par difficulté
- **Sauvegarde cloud** des meilleurs scores
- **Tri intelligent** : temps puis erreurs
- **Historique** des performances

### 💾 **Sauvegarde et chargement**
- **Export JSON** avec métadonnées complètes
- **Import** avec validation de structure
- **Téléchargement/Upload** de fichiers
- **Compatibilité** entre sessions

### ↩️ **Undo/Redo complet**
- **Historique illimité** de toutes les actions
- **Support multi-cellules** : modifications groupées
- **Gestion intelligente** des états
- **Interface intuitive** avec indicateurs visuels

## 🛠️ Technologies utilisées

### **Frontend**
- **React 18** avec TypeScript
- **Tailwind CSS** pour le design moderne
- **Lucide React** pour les icônes
- **Vite** comme bundler rapide

### **Backend & Base de données**
- **Supabase** pour la base de données PostgreSQL
- **Row Level Security** pour la sécurité
- **API REST** automatique
- **Migrations** versionnées

### **Architecture**
- **Patterns GoF** : Command, Factory, Strategy
- **Principes SOLID** appliqués rigoureusement
- **Objets immuables** pour la fiabilité
- **Hooks personnalisés** pour la logique métier

## 🏗️ Architecture et patterns

### **Command Pattern**
```typescript
interface Command {
  execute(): GridState;
  undo(): GridState;
}

class SetValueCommand implements Command {
  // Encapsule les modifications de valeurs
}
```

### **Factory Pattern**
```typescript
class GridFactory {
  static createEmptyGrid(): SudokuGrid
  static updateCell(cell: Cell, updates: Partial<Cell>): Cell
  static generatePuzzle(difficulty: string): SudokuGrid
}
```

### **Strategy Pattern**
```typescript
const handleNumberClick = (number: number) => {
  switch (notationMode) {
    case 'value': // Stratégie valeurs
    case 'corner': // Stratégie coins
    case 'center': // Stratégie centre
  }
}
```

## 🚀 Installation et configuration

### **1. Cloner le projet**
```bash
git clone [url-du-repo]
cd sudoku-master
```

### **2. Installer les dépendances**
```bash
npm install
```


### **4. Lancer l'application**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 🎮 Guide d'utilisation

### **Contrôles de base**
- **Clic** : Sélectionner une cellule
- **Ctrl+Clic** : Sélection multiple
- **Double-clic** : Sélection unique
- **1-9** : Saisir un chiffre
- **Suppr/Backspace** : Effacer
- **Échap** : Désélectionner tout

### **Modes de notation**
1. **Valeur** : Place le chiffre définitif
2. **Coins** : Ajoute des notes dans les coins (max 4)
3. **Centre** : Ajoute des notes au centre
4. **Couleur** : Colore les cellules (9 couleurs)

### **Système d'indices**
1. Choisissez le type d'indice ou laissez "Automatique"
2. Cliquez sur "Obtenir un indice"
3. Lisez l'explication de la technique
4. Appliquez l'indice ou fermez pour continuer

### **Tableau d'honneur**
1. Terminez une partie sans dépasser les erreurs
2. Entrez votre nom dans le modal
3. Votre score est sauvegardé automatiquement
4. Consultez le classement par difficulté

## 📊 Fonctionnalités avancées

### **Validation intelligente**
- Détection en temps réel des conflits
- Surlignage visuel des erreurs
- Comptage précis par type d'erreur

### **Génération de puzzles**
- Algorithme de génération aléatoire
- Garantie d'unicité de solution
- Calibrage précis par difficulté

### **Système d'indices multicouches**
- Analyse automatique des techniques disponibles
- Progression pédagogique des conseils
- Explications détaillées des stratégies

### **Gestion d'état immutable**
- Tous les objets métier sont read-only
- Création de nouveaux objets pour chaque modification
- Historique fiable et prévisible

## 🔧 Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Aperçu du build
npm run lint         # Vérification ESLint
npm run typecheck    # Vérification TypeScript
```

## 📁 Structure du projet

```
src/
├── components/          # Composants React
│   ├── SudokuGrid.tsx  # Grille principale
│   ├── SudokuCell.tsx  # Cellule individuelle
│   ├── NotationPanel.tsx # Panel de notation
│   ├── HintPanel.tsx   # Système d'indices
│   └── ...
├── hooks/              # Hooks personnalisés
│   ├── useSudokuGame.ts # Logique principale
│   └── useGameTimer.ts # Gestion du temps
├── services/           # Services métier
│   ├── command-manager.ts # Gestion undo/redo
│   └── file-manager.ts # Import/export
├── utils/              # Utilitaires
│   ├── sudoku-generator.ts # Génération puzzles
│   ├── sudoku-validator.ts # Validation
│   ├── hint-system.ts  # Système d'indices
│   └── grid-factory.ts # Factory pattern
├── commands/           # Pattern Command
│   └── sudoku-commands.ts
├── types/              # Types TypeScript
│   └── sudoku.ts
└── lib/                # Intégrations externes
    └── supabase.ts     # Configuration Supabase
```

## 🎯 Principes SOLID appliqués

### **S - Single Responsibility**
- `SudokuValidator` : Validation uniquement
- `HintSystem` : Génération d'indices uniquement
- `GridFactory` : Création d'objets uniquement

### **O - Open/Closed**
- Interface `Command` extensible
- Nouveaux types d'indices sans modification
- Ajout de modes de notation facilité

### **L - Liskov Substitution**
- Toutes les commandes interchangeables
- Polymorphisme respecté partout

### **I - Interface Segregation**
- Interfaces spécifiques et ciblées
- Pas de dépendances inutiles

### **D - Dependency Inversion**
- Dépendance aux abstractions
- Injection de dépendances respectée

## 🌟 Points forts techniques

### **Performance**
- Rendu optimisé avec React.memo
- Calculs de validation mis en cache
- Génération de puzzles efficace

### **Accessibilité**
- Navigation clavier complète
- Contrastes respectés
- Feedback visuel clair

### **Responsive Design**
- Adaptation mobile/desktop
- Grille redimensionnable
- Interface tactile optimisée

### **Sécurité**
- Validation côté client et serveur
- Row Level Security Supabase
- Sanitisation des entrées


```





---

## 🗂️ Structure du projet (réorganisée)

Cette structure sépare clairement :
- **app/** : bootstrap + layout global
- **features/sudoku/** : tout le métier Sudoku (UI, logique, services)
- **shared/** : clients/commons réutilisables

```text
├── src/
│   ├── app/
│   │   ├── styles/
│   │   │   └── index.css
│   │   └── App.tsx
│   ├── features/
│   │   └── sudoku/
│   │       ├── hooks/
│   │       │   ├── useGameTimer.ts
│   │       │   └── useSudokuGame.ts
│   │       ├── model/
│   │       │   ├── commands/
│   │       │   │   └── sudokuCommands.ts
│   │       │   ├── gridFactory.ts
│   │       │   ├── hintSystem.ts
│   │       │   ├── sudokuGenerator.ts
│   │       │   ├── sudokuValidator.ts
│   │       │   └── types.ts
│   │       ├── services/
│   │       │   ├── commandManager.ts
│   │       │   ├── fileManager.ts
│   │       │   └── leaderboardService.ts
│   │       └── ui/
│   │           ├── components/
│   │           │   ├── GameTimer.tsx
│   │           │   ├── SudokuCell.tsx
│   │           │   └── SudokuGrid.tsx
│   │           ├── modals/
│   │           │   ├── GameCompletionModal.tsx
│   │           │   ├── GameOverModal.tsx
│   │           │   ├── LeaderboardModal.tsx
│   │           │   └── PlayerNameModal.tsx
│   │           └── panels/
│   │               ├── ControlPanel.tsx
│   │               ├── DifficultySelector.tsx
│   │               ├── HintPanel.tsx
│   │               └── NotationPanel.tsx
│   ├── shared/
│   │   └── api/
│   │       └── supabaseClient.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
│   └── migrations/
│       └── 20251114032954_spring_prism.sql
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### 🔑 Configuration

- Copier `.env.example` vers `.env` puis mettre vos variables Supabase.
