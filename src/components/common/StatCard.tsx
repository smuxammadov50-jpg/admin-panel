import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  tone?: 'neutral' | 'positive' | 'accent';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  tone = 'neutral',
  onClick,
}) => {
  const subtextClass =
    tone === 'positive'
      ? 'text-emerald-700 dark:text-emerald-400'
      : tone === 'accent'
        ? 'text-blue-700 dark:text-blue-400'
        : 'text-slate-500 dark:text-slate-400';

  const baseClass =
    'flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors dark:border-slate-800 dark:bg-slate-900';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} w-full hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:border-slate-700`}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </span>
          <Icon className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
        </div>
        <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
          {value}
        </div>
        <div className={`mt-1.5 truncate text-xs font-medium ${subtextClass}`}>
          {subtext}
        </div>
      </button>
    );
  }

  return (
    <div className={baseClass}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <Icon className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
      </div>
      <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
        {value}
      </div>
      <div className={`mt-1.5 truncate text-xs font-medium ${subtextClass}`}>
        {subtext}
      </div>
    </div>
  );
};
