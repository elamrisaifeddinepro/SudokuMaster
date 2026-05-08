# Déploiement — Sudoku Master

Ce document explique comment préparer le projet pour un hébergement statique.

## Build local

Installer les dépendances :

```bash
npm install
```

Lancer les vérifications :

```bash
npm run ci
```

Générer le build de production :

```bash
npm run build
```

Le dossier généré est :

```text
dist/
```

Prévisualiser localement le build :

```bash
npm run preview
```

> `npm run preview` sert à vérifier localement le build généré. Ce n'est pas un serveur de production.

---

## Variables d'environnement

Créer un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Variables utilisées :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Ces variables sont nécessaires uniquement pour le leaderboard Supabase. Le jeu fonctionne sans elles, mais le classement en ligne sera désactivé.

---

## Déploiement Vercel

Configuration recommandée :

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Ajouter dans les variables d'environnement Vercel :

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## Déploiement Netlify

Configuration recommandée :

```text
Build command: npm run build
Publish directory: dist
```

Ajouter dans les variables d'environnement Netlify :

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## Déploiement GitHub Pages

GitHub Pages est possible, mais il faut adapter `vite.config.ts` si le site est publié sous un sous-chemin.

Exemple pour un dépôt nommé `sudoku-master` :

```ts
export default defineConfig({
  base: '/sudoku-master/',
  plugins: [react()],
});
```

Si le site est déployé à la racine d'un domaine personnalisé, ne pas ajouter ce `base`.

---

## Checklist avant publication

- [ ] `npm run ci` passe localement.
- [ ] `.env` n'est pas commité.
- [ ] `.env.example` ne contient aucun secret réel.
- [ ] Le README contient les captures d'écran.
- [ ] Les variables Supabase sont configurées sur la plateforme de déploiement.
- [ ] La migration SQL Supabase a été exécutée.
- [ ] Le lien live est ajouté dans le README.
