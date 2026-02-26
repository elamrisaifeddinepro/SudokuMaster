import SudokuGrid from '@/features/sudoku/ui/components/SudokuGrid';
import useSudokuGame from '@/features/sudoku/hooks/useSudokuGame';

function App() {
  const { grid, selected, conflicts, selectCell } = useSudokuGame();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">SudokuMaster</h1>
          <p className="mt-2 text-slate-300">Jour 4 — Validation + surbrillance des conflits</p>
        </header>

        <main className="flex flex-col items-center gap-6">
          <SudokuGrid grid={grid} selected={selected} conflicts={conflicts} onCellClick={selectCell} />

          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold">Instructions</h2>
            <ul className="mt-2 list-disc pl-5 text-slate-300 space-y-1">
              <li>Clique une cellule, tape <b>1..9</b> ✅</li>
              <li>Si tu crées un doublon (ligne/colonne/bloc), les cases en conflit deviennent <b>rouges</b> ✅</li>
              <li>Backspace/Delete pour effacer ✅</li>
            </ul>

            <p className="mt-3 text-sm text-slate-400">
              Conflits détectés : <b>{conflicts.size}</b>
            </p>

            <p className="mt-3 text-sm text-slate-400">
              Prochain jour : panel de notation (value/corner/center) + boutons 1..9.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;