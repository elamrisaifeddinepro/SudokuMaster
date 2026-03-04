import { useEffect, useState } from 'react';

type Props = {
  isOpen: boolean;
  defaultName?: string;
  onSubmit: (name: string) => void;
  onClose: () => void;
};

export default function PlayerNameModal({ isOpen, defaultName = '', onSubmit, onClose }: Props) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) setName(defaultName);
  }, [isOpen, defaultName]);

  if (!isOpen) return null;

  const submit = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return;
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-100">Enregistrer ton score</h2>
        <p className="mt-2 text-slate-300">Entre ton nom (min 2 caractères).</p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Saif"
          className="mt-4 w-full h-11 rounded-xl border border-slate-800 bg-slate-900/40 px-3 text-slate-100 outline-none focus:border-cyan-400"
        />

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={submit}
            className="flex-1 h-11 rounded-xl border border-slate-800 bg-emerald-500/10 text-emerald-200 font-semibold hover:bg-emerald-500/15 transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-100 font-semibold hover:bg-slate-800/40 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}