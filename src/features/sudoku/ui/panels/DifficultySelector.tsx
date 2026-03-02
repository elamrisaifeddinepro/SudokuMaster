export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

type Props = {
  difficulty: Difficulty;
  onChange: (d: Difficulty) => void;
};

const OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
];

export default function DifficultySelector({ difficulty, onChange }: Props) {
  return (
    <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-lg font-semibold">Difficulty</h2>
      <p className="mt-1 text-sm text-slate-400">Choisis une difficulté (sera utilisée pour le vrai générateur plus tard).</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {OPTIONS.map((opt) => {
          const active = opt.value === difficulty;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                'h-11 rounded-xl border border-slate-800 font-semibold transition',
                active ? 'bg-cyan-500/15 text-cyan-200' : 'bg-slate-950/50 text-slate-100 hover:bg-slate-800/40',
              ].join(' ')}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}