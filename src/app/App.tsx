import SudokuGrid from '@/features/sudoku/ui/components/SudokuGrid';
import useSudokuGame from '@/features/sudoku/hooks/useSudokuGame';
import NotationPanel from '@/features/sudoku/ui/panels/NotationPanel';

function App() {
  const { grid, selected, conflicts, selectCell, mode, setMode, inputDigit, clearActive } = useSudokuGame();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">SudokuMaster</h1>
          <p className="mt-2 text-slate-300">Jour 6 — Modes Value/Corner/Center + notes visibles</p>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
          <div className="flex flex-col items-center gap-4">
            <SudokuGrid grid={grid} selected={selected} conflicts={conflicts} onCellClick={selectCell} />

            <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <h2 className="text-lg font-semibold">Instructions</h2>
              <ul className="mt-2 list-disc pl-5 text-slate-300 space-y-1">
                <li>Choisis un mode : <b>Value</b>, <b>Corner</b>, <b>Center</b></li>
                <li>Clique une cellule puis tape <b>1..9</b> ou clique sur les boutons</li>
                <li><b>Clear</b> efface selon le mode (Value → valeur, Corner → notes coins, Center → notes centre)</li>
                <li>Les conflits (doublons) restent détectés en rouge (sur les valeurs) ✅</li>
              </ul>

              <p className="mt-3 text-sm text-slate-400">
                Mode : <b>{mode}</b> — Cellule : <b>{selected ? `(${selected.row}, ${selected.col})` : 'Aucune'}</b> — Conflits :{' '}
                <b>{conflicts.size}</b>
              </p>

              <p className="mt-3 text-sm text-slate-400">Prochain jour : Timer (chrono) + composant GameTimer.</p>
            </div>
          </div>

          <NotationPanel mode={mode} onModeChange={setMode} onDigit={inputDigit} onClear={clearActive} />
        </main>
      </div>
    </div>
  );
}

export default App;