import { useMemo } from 'react';
import { createMockGrid } from '@/features/sudoku/model/gridFactory';

function App() {
  const grid = useMemo(() => createMockGrid(), []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">SudokuMaster</h1>
          <p className="mt-2 text-slate-300">Jour 1 — Types + gridFactory (grille mock)</p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-lg font-semibold">Grille mock (valeurs “given”)</h2>

          <div className="mt-4 grid grid-cols-9 gap-1">
            {grid.flat().map((cell) => (
              <div
                key={`${cell.row}-${cell.col}`}
                className={[
                  'h-10 w-10 rounded-md flex items-center justify-center text-sm',
                  'border border-slate-800',
                  cell.given ? 'bg-slate-800 text-slate-100 font-bold' : 'bg-slate-900 text-slate-300',
                ].join(' ')}
                title={`r${cell.row} c${cell.col}`}
              >
                {cell.value ?? ''}
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Prochain jour : UI complète (SudokuGrid + SudokuCell) + sélection.
          </p>
        </section>
      </div>
    </div>
  );
}

export default App;