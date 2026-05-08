import React from 'react';

import { useSudokuGame } from '@/features/sudoku/hooks/useSudokuGame';

import { SudokuGrid } from '@/features/sudoku/ui/components/SudokuGrid';
import { GameTimer } from '@/features/sudoku/ui/components/GameTimer';

import { ControlPanel } from '@/features/sudoku/ui/panels/ControlPanel';
import { DifficultySelector } from '@/features/sudoku/ui/panels/DifficultySelector';
import { NotationPanel } from '@/features/sudoku/ui/panels/NotationPanel';
import { HintPanel } from '@/features/sudoku/ui/panels/HintPanel';

import { GameCompletionModal } from '@/features/sudoku/ui/modals/GameCompletionModal';
import { GameOverModal } from '@/features/sudoku/ui/modals/GameOverModal';
import { PlayerNameModal } from '@/features/sudoku/ui/modals/PlayerNameModal';
import { LeaderboardModal } from '@/features/sudoku/ui/modals/LeaderboardModal';
import { StatsModal } from '@/features/sudoku/ui/modals/StatsModal';
import { ConfirmationModal } from '@/features/sudoku/ui/modals/ConfirmationModal';
import { useI18n } from '@/shared/i18n/i18n';

import { Grid3x3 as Grid3X3, AlertTriangle, Lightbulb, Gauge, Wrench, Languages } from 'lucide-react';

type ToolPanel = 'controls' | 'difficulty' | 'hints' | null;

function App() {
  const { language, setLanguage, t, difficultyName } = useI18n();
  const {
    gridState,
    notationMode,
    currentDifficulty,
    canUndo,
    canRedo,
    isGameComplete,
    isGameOver,
    errorCount,
    maxErrors,
    currentHint,
    hintsUsed,
    maxHints,
    availableHintTypes,
    showPlayerNameModal,
    showLeaderboard,
    showStatsModal,
    gameTime,
    isTimerRunning,
    isPaused,
    hasLocalSave,
    lastLocalSaveAt,
    setNotationMode,
    handleDifficultyChange,
    handleCellClick,
    handleCellDoubleClick,
    handleNumberClick,
    handleColorClick,
    handleClear,
    handleUndo,
    handleRedo,
    handleSave,
    handleLoad,
    handleRestoreLocalSave,
    handleClearLocalSave,
    handleNewGame,
    handleNewPuzzle,
    handleTogglePause,
    handleCloseCompletion,
    handleCloseGameOver,
    handleGetHint,
    handleApplyHint,
    handleClearHint,
    handleSaveScore,
    handleSkipScore,
    handleShowLeaderboard,
    handleCloseLeaderboard,
    handleShowStats,
    handleCloseStats
  } = useSudokuGame();

  const remainingHints = Math.max(0, maxHints - hintsUsed);
  const [openTool, setOpenTool] = React.useState<ToolPanel>(null);
  const [pendingNewPuzzleDifficulty, setPendingNewPuzzleDifficulty] = React.useState<string | null>(null);

  const requestNewPuzzle = (difficulty: string) => {
    setPendingNewPuzzleDifficulty(difficulty);
  };

  const confirmNewPuzzle = () => {
    if (!pendingNewPuzzleDifficulty) return;
    handleNewPuzzle(pendingNewPuzzleDifficulty);
    setPendingNewPuzzleDifficulty(null);
    setOpenTool(null);
  };

  const cancelNewPuzzle = () => {
    setPendingNewPuzzleDifficulty(null);
  };

  const requestNewGame = () => {
    setPendingNewPuzzleDifficulty(currentDifficulty);
  };

  const toggleTool = (tool: Exclude<ToolPanel, null>) => {
    setOpenTool((prev) => (prev === tool ? null : tool));
  };

  const closeTool = () => setOpenTool(null);

  return (
    <div className="min-h-screen app-bg">
      {/* Barre d'outils (icônes + libellés) */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        <button
          type="button"
          aria-label={t('toolbar.controls')}
          onClick={() => toggleTool('controls')}
          className={`group h-12 rounded-2xl shadow-lg border flex items-center gap-3 px-4 transition-all ${
            openTool === 'controls'
              ? 'bg-cyan-500/15 text-cyan-100 border-cyan-300 glow-cyan'
              : 'app-surface text-slate-200 border-slate-700 hover:bg-slate-900/80'
          }`}
          title={t('toolbar.controls')}
        >
          <Wrench className="w-5 h-5" />
          <span className="text-sm font-semibold whitespace-nowrap">{t('toolbar.controls')}</span>
        </button>

        <button
          type="button"
          aria-label={t('toolbar.difficultyLong')}
          onClick={() => toggleTool('difficulty')}
          className={`group h-12 rounded-2xl shadow-lg border flex items-center gap-3 px-4 transition-all ${
            openTool === 'difficulty'
              ? 'bg-cyan-500/15 text-cyan-100 border-cyan-300 glow-cyan'
              : 'app-surface text-slate-200 border-slate-700 hover:bg-slate-900/80'
          }`}
          title={t('toolbar.difficultyLong')}
        >
          <Gauge className="w-5 h-5" />
          <span className="text-sm font-semibold whitespace-nowrap">{t('toolbar.difficulty')}</span>
        </button>

        <button
          type="button"
          aria-label={t('toolbar.hints')}
          onClick={() => toggleTool('hints')}
          className={`group h-12 rounded-2xl shadow-lg border flex items-center gap-3 px-4 transition-all ${
            openTool === 'hints'
              ? 'bg-cyan-500/15 text-cyan-100 border-cyan-300 glow-cyan'
              : 'app-surface text-slate-200 border-slate-700 hover:bg-slate-900/80'
          }`}
          title={t('toolbar.hints')}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm font-semibold whitespace-nowrap">{t('toolbar.hints')}</span>
        </button>
      </div>

      {/* Panneau flottant (ouvre les options quand on clique sur une icône) */}
      {openTool && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
          role="presentation"
          onMouseDown={closeTool}
        >
          <div
            className="fixed left-44 top-1/2 -translate-y-1/2 z-50 w-[360px] max-w-[calc(100vw-13rem)] max-h-[80vh] overflow-auto app-surface rounded-3xl shadow-2xl border border-slate-700 p-4"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {openTool === 'controls' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-100 font-semibold">
                    <Wrench className="w-4 h-4" />
                    <span>{t('toolbar.controls')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={closeTool}
                    className="text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800/60"
                    aria-label={t('common.close')}
                  >
                    ✕
                  </button>
                </div>

                <ControlPanel
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  onSave={handleSave}
                  onLoad={handleLoad}
                  onNewGame={requestNewGame}
                  onTogglePause={handleTogglePause}
                  onRestoreLocalSave={handleRestoreLocalSave}
                  onClearLocalSave={handleClearLocalSave}
                  isPaused={isPaused}
                  hasLocalSave={hasLocalSave}
                  lastLocalSaveAt={lastLocalSaveAt}
                  onShowLeaderboard={handleShowLeaderboard}
                  onShowStats={handleShowStats}
                />
              </div>
            )}

            {openTool === 'difficulty' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-100 font-semibold">
                    <Gauge className="w-4 h-4" />
                    <span>{t('toolbar.difficultyLong')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={closeTool}
                    className="text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800/60"
                    aria-label={t('common.close')}
                  >
                    ✕
                  </button>
                </div>

                <DifficultySelector
                  selectedDifficulty={currentDifficulty}
                  onDifficultyChange={handleDifficultyChange}
                  onNewPuzzle={requestNewPuzzle}
                />
              </div>
            )}

            {openTool === 'hints' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-100 font-semibold">
                    <Lightbulb className="w-4 h-4" />
                    <span>{t('toolbar.hints')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={closeTool}
                    className="text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800/60"
                    aria-label={t('common.close')}
                  >
                    ✕
                  </button>
                </div>

                <HintPanel
                  onGetHint={(hintType?: string) => handleGetHint(hintType ?? 'auto')}
                  currentHint={currentHint}
                  onApplyHint={handleApplyHint}
                  onClearHint={handleClearHint}
                  hintsUsed={hintsUsed}
                  maxHints={maxHints}
                  availableHintTypes={availableHintTypes}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="modal-pop inline-flex items-center gap-4 app-surface rounded-3xl px-8 py-4 shadow-xl border border-cyan-300/20">
            <div className="animate-float-slow p-3 bg-gradient-to-br from-cyan-500 to-fuchsia-600 rounded-2xl shadow-lg glow-fuchsia">
              <Grid3X3 className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-200 via-slate-100 to-fuchsia-200 bg-clip-text text-transparent">
                {t('app.title')}
              </h1>
              <p className="text-sm text-slate-300 font-medium">{t('app.difficulty', { difficulty: difficultyName(currentDifficulty) })}</p>
            </div>
            <div className="ml-2 flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/30 p-1" aria-label={t('language.label')}>
              <Languages className="ml-2 h-4 w-4 text-slate-300" aria-hidden="true" />
              {(['fr', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${language === lang ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-400/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}`}
                  aria-pressed={language === lang}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Barre de statut */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-wrap items-center justify-center gap-4 app-surface rounded-2xl px-6 py-4 shadow-lg border border-cyan-300/15">
            <div className="flex items-center gap-3 app-surface-strong rounded-xl px-4 py-2 border border-slate-700">
              <GameTimer seconds={gameTime} isRunning={isTimerRunning} />
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border ${
                errorCount === 0
                  ? 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30'
                  : errorCount >= maxErrors - 2
                    ? 'bg-rose-500/10 text-rose-200 border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-200 border-amber-500/30'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>
                {t('status.errors', { count: errorCount, max: maxErrors })}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-fuchsia-500/10 text-fuchsia-200 px-4 py-2 rounded-xl border border-fuchsia-500/30 font-semibold">
              <Lightbulb className="w-4 h-4" />
              <span>
                {t('status.hints', { count: remainingHints, plural: remainingHints > 1 ? 's' : '' })}
              </span>
            </div>
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Centre */}
          <main className="lg:col-span-2 flex flex-col items-center">
            <div className="mb-6 relative rounded-3xl overflow-hidden border border-cyan-300/10 shadow-2xl shadow-cyan-950/30">
              <SudokuGrid
                gridState={gridState}
                onCellClick={handleCellClick}
                onCellDoubleClick={handleCellDoubleClick}
              />

              {isPaused && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-slate-950/95 border border-cyan-400/30 rounded-3xl text-center p-6">
                  <div className="text-5xl">⏸️</div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">{t('pause.title')}</h2>
                    <p className="text-slate-300 text-sm max-w-xs">
                      {t('pause.message')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTogglePause}
                    className="px-5 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-400/40 font-semibold transition-colors glow-cyan"
                  >
                    {t('pause.resume')}
                  </button>
                </div>
              )}
            </div>

            {gridState.selectedCells.length > 0 && (
              <div className="modal-pop bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 px-6 py-3 rounded-xl shadow-sm">
                <span className="font-medium">
                  {t('selection.cells', { count: gridState.selectedCells.length, plural: gridState.selectedCells.length > 1 ? 's' : '' })}
                </span>
              </div>
            )}

            <div className="mt-4 bg-slate-950/30 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm">
              ⌨️ <strong>{t('shortcuts.label')}</strong> {t('shortcuts.text')}
            </div>
          </main>

          {/* Droite (Mode de notation reste toujours visible) */}
          <aside className="lg:col-span-1 space-y-6">
            <NotationPanel
              mode={notationMode}
              onModeChange={setNotationMode}
              onNumberClick={handleNumberClick}
              onColorClick={handleColorClick}
              onClear={handleClear}
            />
          </aside>
        </div>
      </div>

      {/* Modals */}
      <GameCompletionModal
        isOpen={isGameComplete}
        difficulty={currentDifficulty}
        completionTime={gameTime}
        onNewGame={handleNewGame}
        onClose={handleCloseCompletion}
      />

      <GameOverModal
        isOpen={isGameOver}
        difficulty={currentDifficulty}
        gameTime={gameTime}
        errorCount={errorCount}
        maxErrors={maxErrors}
        onNewGame={handleNewGame}
        onClose={handleCloseGameOver}
      />

      <PlayerNameModal
        isOpen={showPlayerNameModal}
        difficulty={currentDifficulty}
        completionTime={gameTime}
        errorCount={errorCount}
        onSave={handleSaveScore}
        onSkip={handleSkipScore}
      />

      <LeaderboardModal isOpen={showLeaderboard} onClose={handleCloseLeaderboard} />
      <StatsModal isOpen={showStatsModal} onClose={handleCloseStats} />

      <ConfirmationModal
        isOpen={pendingNewPuzzleDifficulty !== null}
        title={t('confirm.title')}
        message={t('confirm.message')}
        confirmLabel={t('confirm.ok')}
        cancelLabel={t('confirm.cancel')}
        onConfirm={confirmNewPuzzle}
        onCancel={cancelNewPuzzle}
      />
    </div>
  );
}

export default App;
