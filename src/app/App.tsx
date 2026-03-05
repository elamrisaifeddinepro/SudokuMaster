import SudokuGrid from '@/features/sudoku/ui/components/SudokuGrid';
import NotationPanel from '@/features/sudoku/ui/panels/NotationPanel';
import GameTimer from '@/features/sudoku/ui/components/GameTimer';
import ControlPanel from '@/features/sudoku/ui/panels/ControlPanel';
import DifficultySelector from '@/features/sudoku/ui/panels/DifficultySelector';
import useSudokuGame from '@/features/sudoku/hooks/useSudokuGame';

import GameCompletionModal from '@/features/sudoku/ui/modals/GameCompletionModal';
import GameOverModal from '@/features/sudoku/ui/modals/GameOverModal';
import PlayerNameModal from '@/features/sudoku/ui/modals/PlayerNameModal';
import LeaderboardModal from '@/features/sudoku/ui/modals/LeaderboardModal';

import StatusCard from '@/features/sudoku/ui/components/StatusCard';
import { isSupabaseConfigured } from '@/shared/api/supabaseClient';

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

    difficulty,
    setDifficulty,

    isCompleted,
    isGameOver,
    closeCompleted,
    closeGameOver,

    isPlayerNameOpen,
    closePlayerName,
    submitPlayerName,
    defaultPlayerName,

    isLeaderboardOpen,
    leaderboard,
    openLeaderboard,
    closeLeaderboard,
    clearLeaderboard,

    lastSavedName,
  } = useSudokuGame();

  const toggleTimer = () => (timerRunning ? pauseTimer() : startTimer());
  const sourceLabel = isSupabaseConfigured ? 'Supabase' : 'Local';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SudokuMaster</h1>
            <p className="mt-2 text-slate-300">Jour 17 — UI polish</p>
            <p className="mt-1 text-sm text-slate-400">
              Leaderboard source: <b className="text-slate-200">{sourceLabel}</b>
            </p>
          </div>
          <GameTimer seconds={timerSeconds} isRunning={timerRunning} />
        </header>

        <main className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] items-start">
          {/* LEFT */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Board</h2>
                  <p className="text-sm text-slate-400">Clique une cellule puis utilise le keypad ou le clavier.</p>
                </div>
                <div className="text-sm text-slate-400">
                  Conflicts: <b className="text-slate-100">{conflicts.size}</b>
                </div>
              </div>
              <div className="flex justify-center">
                <SudokuGrid grid={grid} selected={selected} conflicts={conflicts} onCellClick={selectCell} />
              </div>
            </div>

            <StatusCard
              mode={mode}
              difficulty={difficulty}
              selected={selected}
              conflictsCount={conflicts.size}
              timerSeconds={timerSeconds}
              timerRunning={timerRunning}
              leaderboardSourceLabel={sourceLabel}
              lastSavedName={lastSavedName}
            />
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-6">
            <DifficultySelector difficulty={difficulty} onChange={setDifficulty} />

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
              onOpenLeaderboard={openLeaderboard}
            />

            <NotationPanel mode={mode} onModeChange={setMode} onDigit={inputDigit} onClear={clearActive} />
          </div>
        </main>
      </div>

      <GameCompletionModal isOpen={isCompleted} timeSeconds={timerSeconds} onClose={closeCompleted} onNewGame={newGame} />
      <GameOverModal isOpen={isGameOver} onClose={closeGameOver} onNewGame={newGame} />

      <PlayerNameModal isOpen={isPlayerNameOpen} defaultName={defaultPlayerName} onClose={closePlayerName} onSubmit={submitPlayerName} />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        entries={leaderboard}
        sourceLabel={sourceLabel}
        onClose={closeLeaderboard}
        onClear={clearLeaderboard}
      />
    </div>
  );
}

export default App;