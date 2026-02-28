import SudokuGrid from '@/features/sudoku/ui/components/SudokuGrid';
import NotationPanel from '@/features/sudoku/ui/panels/NotationPanel';
import GameTimer from '@/features/sudoku/ui/components/GameTimer';
import ControlPanel from '@/features/sudoku/ui/panels/ControlPanel';
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

    canUndo,
    canRedo,
    undo,
    redo,
    newGame,

    timerSeconds,
    timerRunning,
    pauseTimer,
    startTimer,
    resetTimer,

    saveGame,
    loadGame,
  } = useSudokuGame();

  const toggleTimer = () => (timerRunning ? pauseTimer() : startTimer());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SudokuMaster</h1>
            <p className="mt-2 text-slate-300">Jour 9 — Save/Load JSON</p>
          </div>
          <GameTimer seconds={timerSeconds} isRunning={timerRunning} />
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
              <p className="mt-2 text-sm text-slate-400">
                Prochain jour : améliorer Load pour restaurer le timer exact (setSeconds).
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <ControlPanel
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
              onNewGame={newGame}
              timerRunning={timerRunning}
              onToggleTimer={toggleTimer}
              onResetTimer={resetTimer}
              onSave={saveGame}
              onLoad={loadGame}
            />

            <NotationPanel mode={mode} onModeChange={setMode} onDigit={inputDigit} onClear={clearActive} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;