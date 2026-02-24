import { useMemo, useState } from 'react';

function App() {
  const [day, setDay] = useState(0);

  const todayGoal = useMemo(() => {
    return [
      'Repo GitHub "SudokuMaster" prêt',
      'Vite + React + TypeScript OK',
      'Tailwind OK',
      'ESLint OK',
      'CI GitHub build OK',
      'Build local OK (npm run build)',
    ];
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">SudokuMaster</h1>
          <p className="mt-2 text-slate-300">
            Jour <span className="font-semibold text-slate-100">{day}</span> — Base du projet (compilation OK)
          </p>
        </header>

        <main className="space-y-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold">✅ Objectifs du Jour 0</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-200">
              {todayGoal.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold">Test rapide</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setDay((d) => d + 1)}
                className="rounded-xl bg-cyan-500/15 px-4 py-2 font-semibold text-cyan-200 border border-cyan-400/30 hover:bg-cyan-500/25 transition"
              >
                Simuler Jour suivant
              </button>
              <span className="self-center text-slate-300">(Juste pour vérifier que React fonctionne)</span>
            </div>
          </section>
        </main>

        <footer className="mt-10 text-sm text-slate-500">
          Prochaine étape: Jour 1 → types Sudoku + gridFactory + structure feature.
        </footer>
      </div>
    </div>
  );
}

export default App;
