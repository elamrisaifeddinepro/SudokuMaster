import SudokuGrid from '@/features/sudoku/ui/components/SudokuGrid';
import NotationPanel from '@/features/sudoku/ui/panels/NotationPanel';
import GameTimer from '@/features/sudoku/ui/components/GameTimer';
import useSudokuGame from '@/features/sudoku/hooks/useSudokuGame';

function App() {
  const {
    grid,
    selected,
    conflicts,
    selectCell,
    mode,
    setMode,
    inputDigit,
    clearActive,
    timerSeconds,
    timerRunning,
    pauseTimer,
    startTimer,
    resetTimer,
  } = useSudokuGame();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SudokuMaster</h1>
            <p className="mt-2 text-slate-300">Jour 7 — Timer (start/pause/reset)</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <GameTimer seconds={timerSeconds} isRunning={timerRunning} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={timerRunning ? pauseTimer : startTimer}
                className="h-11 rounded-xl border border-slate-800 bg-slate-900/40 px-4 font-semibold hover:bg-slate-800/40 transition"
              >
                {timerRunning ? 'Pause' : 'Start'}
              </button>
              <button
                type="button"
                onClick={resetTimer}
                className="h-11 rounded-xl border border-slate-800 bg-slate-900/40 px-4 font-semibold hover:bg-slate-800/40 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
          <div className="flex flex-col items-center gap-4">
            <SudokuGrid grid={grid} selected={selected} conflicts={conflicts} onCellClick={selectCell} />

            <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <h2 className="text-lg font-semibold">Infos</h2>
              <p className="mt-2 text-slate-300">
                Mode: <b>{mode}</b> — Cellule: <b>{selected ? `(${selected.row}, ${selected.col})` : 'Aucune'}</b> — Conflits:{' '}
                <b>{conflicts.size}</b>
              </p>
              <p className="mt-3 text-sm text-slate-400">
                Prochain jour : ControlPanel (Undo/Redo + New Game + Save/Load).
              </p>
            </div>
          </div>

          <NotationPanel mode={mode} onModeChange={setMode} onDigit={inputDigit} onClear={clearActive} />
        </main>
      </div>
    </div>
  );
}

export default App;