import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-pop app-surface rounded-2xl shadow-2xl max-w-md w-full border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-amber-500/10">
          <div className="flex items-center gap-3 text-amber-100">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900/60 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-slate-200 leading-relaxed">{message}</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-3 rounded-lg border border-slate-700 bg-slate-950/30 text-slate-200 hover:bg-slate-900/70 transition-colors font-medium"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-3 rounded-lg border border-fuchsia-400/40 bg-fuchsia-500/20 text-fuchsia-100 hover:bg-fuchsia-500/30 transition-colors font-semibold"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
