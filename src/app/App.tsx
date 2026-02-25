import { useMemo } from 'react';
import { createMockGrid } from '@/features/sudoku/model/gridFactory';
import SudokuGrid from '@/features/sudoku/ui/components/SudokuGrid';
import type { Cell } from '@/features/sudoku/model/types';

function App() {
  const grid = useMemo(() => createMockGrid(), []);

  const handleCellClick = (cell: Cell) => {
    // Jour 3: on branchera la sélection + input
    console.log('Cell clicked:', cell.row, cell.col);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">SudokuMaster</h1>
          <p className="mt-2 text-slate-300">Jour 2 — UI (SudokuGrid + SudokuCell)</p>
        </header>

        <main className="flex flex-col items-center gap-6">
          <SudokuGrid grid={grid} onCellClick={handleCellClick} />

          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-semibold">Statut</h2>
            <ul className="mt-2 list-disc pl-5 text-slate-300 space-y-1">
              <li>Grille affichée via composants UI ✅</li>
              <li>Clicks détectés (console) ✅</li>
              <li>Prochain : sélection + saisie (Jour 3)</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;