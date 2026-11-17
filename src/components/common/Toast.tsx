import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print fixed inset-x-4 bottom-4 z-50 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-lg sm:inset-x-auto sm:right-4 sm:max-w-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-700"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
