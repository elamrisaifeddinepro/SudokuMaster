/* eslint-disable react-refresh/only-export-components */
import React from 'react';

export type Language = 'fr' | 'en';
type Params = Record<string, string | number>;

const STORAGE_KEY = 'sudoku-master-language';
const translations = {
  fr: {
    'language.label': 'Langue', 'app.title': 'Sudoku Master', 'app.difficulty': 'Difficulté : {{difficulty}}',
    'toolbar.controls': 'Contrôles', 'toolbar.difficulty': 'Difficulté', 'toolbar.difficultyLong': 'Niveau de difficulté', 'toolbar.hints': 'Indices',
    'common.close': 'Fermer', 'status.errors': '{{count}} / {{max}} erreurs', 'status.hints': '{{count}} indice{{plural}}',
    'pause.title': 'Partie en pause', 'pause.message': 'La grille est masquée pour préserver votre partie. Cliquez sur reprendre pour continuer.', 'pause.resume': 'Reprendre la partie',
    'selection.cells': '✨ {{count}} cellule{{plural}} sélectionnée{{plural}}', 'shortcuts.label': 'Raccourcis :', 'shortcuts.text': 'flèches (déplacement), Shift+flèches (sélection multiple), 1-9 (saisie), Suppr (effacer), P (pause), Échap (désélectionner), Ctrl+Clic (sélection multiple)',
    'confirm.title': 'Nouvelle grille ?', 'confirm.message': 'Votre progression actuelle sera perdue. Voulez-vous vraiment commencer une nouvelle grille ?', 'confirm.ok': 'Oui, nouvelle grille', 'confirm.cancel': 'Continuer la partie',
    'control.undo': 'Annuler', 'control.redo': 'Refaire', 'control.pause': 'Pause', 'control.resume': 'Reprendre', 'control.save': 'Sauvegarder', 'control.load': 'Charger', 'control.newGrid': 'Nouvelle grille', 'control.leaderboard': "Tableau d'honneur", 'control.stats': 'Statistiques', 'control.restore': 'Reprendre', 'control.clear': 'Effacer', 'control.noSave': 'Aucune sauvegarde locale disponible', 'control.saveAt': 'Sauvegarde locale : {{date}}', 'control.available': 'disponible',
    'difficulty.title': 'Niveau de difficulté', 'difficulty.new': 'Nouvelle grille {{difficulty}}', 'difficulty.facile': 'Facile', 'difficulty.moyen': 'Moyen', 'difficulty.difficile': 'Difficile', 'difficulty.expert': 'Expert', 'difficulty.facile.desc': '46 chiffres donnés', 'difficulty.moyen.desc': '36 chiffres donnés', 'difficulty.difficile.desc': '26 chiffres donnés', 'difficulty.expert.desc': '21 chiffres donnés',
    'notation.title': 'Mode de notation', 'notation.value': 'Valeur', 'notation.corner': 'Coins', 'notation.center': 'Centre', 'notation.color': 'Couleur', 'notation.numbers': 'Chiffres', 'notation.colors': 'Couleurs', 'notation.removeColor': 'Enlever couleur', 'notation.clear': 'Effacer'
  },
  en: {
    'language.label': 'Language', 'app.title': 'Sudoku Master', 'app.difficulty': 'Difficulty: {{difficulty}}',
    'toolbar.controls': 'Controls', 'toolbar.difficulty': 'Difficulty', 'toolbar.difficultyLong': 'Difficulty level', 'toolbar.hints': 'Hints',
    'common.close': 'Close', 'status.errors': '{{count}} / {{max}} errors', 'status.hints': '{{count}} hint{{plural}}',
    'pause.title': 'Game paused', 'pause.message': 'The grid is hidden to protect your progress. Click resume to continue.', 'pause.resume': 'Resume game',
    'selection.cells': '✨ {{count}} cell{{plural}} selected', 'shortcuts.label': 'Shortcuts:', 'shortcuts.text': 'arrows (move), Shift+arrows (multi-select), 1-9 (input), Delete (clear), P (pause), Esc (deselect), Ctrl+Click (multi-select)',
    'confirm.title': 'New grid?', 'confirm.message': 'Your current progress will be lost. Do you really want to start a new grid?', 'confirm.ok': 'Yes, new grid', 'confirm.cancel': 'Continue game',
    'control.undo': 'Undo', 'control.redo': 'Redo', 'control.pause': 'Pause', 'control.resume': 'Resume', 'control.save': 'Save', 'control.load': 'Load', 'control.newGrid': 'New grid', 'control.leaderboard': 'Leaderboard', 'control.stats': 'Statistics', 'control.restore': 'Resume', 'control.clear': 'Clear', 'control.noSave': 'No local save available', 'control.saveAt': 'Local save: {{date}}', 'control.available': 'available',
    'difficulty.title': 'Difficulty level', 'difficulty.new': 'New {{difficulty}} grid', 'difficulty.facile': 'Easy', 'difficulty.moyen': 'Medium', 'difficulty.difficile': 'Hard', 'difficulty.expert': 'Expert', 'difficulty.facile.desc': '46 given numbers', 'difficulty.moyen.desc': '36 given numbers', 'difficulty.difficile.desc': '26 given numbers', 'difficulty.expert.desc': '21 given numbers',
    'notation.title': 'Notation mode', 'notation.value': 'Value', 'notation.corner': 'Corners', 'notation.center': 'Center', 'notation.color': 'Color', 'notation.numbers': 'Numbers', 'notation.colors': 'Colors', 'notation.removeColor': 'Remove color', 'notation.clear': 'Clear'
  }
} as const;

type TranslationKey = keyof typeof translations.fr;

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Params) => string;
  difficultyName: (difficulty: string) => string;
  difficultyDescription: (difficulty: string) => string;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'fr';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'en' || stored === 'fr' ? stored : 'fr';
};

export const I18nProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [language, setLanguageState] = React.useState<Language>(getInitialLanguage);

  const setLanguage = React.useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage;
  }, []);

  React.useEffect(() => { document.documentElement.lang = language; }, [language]);

  const t = React.useCallback((key: TranslationKey, params: Params = {}) => {
    const template = String(translations[language][key] ?? translations.fr[key] ?? key);
    return Object.entries(params).reduce<string>((text, [paramKey, value]) => text.split(`{{${paramKey}}}`).join(String(value)), template);
  }, [language]);

  const difficultyName = React.useCallback((difficulty: string) => t(`difficulty.${difficulty}` as TranslationKey), [t]);
  const difficultyDescription = React.useCallback((difficulty: string) => t(`difficulty.${difficulty}.desc` as TranslationKey), [t]);

  const value = React.useMemo(() => ({ language, setLanguage, t, difficultyName, difficultyDescription }), [difficultyDescription, difficultyName, language, setLanguage, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = React.useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
};
