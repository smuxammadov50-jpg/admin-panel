import React, { useState } from 'react';
import type { Group } from '../../types';

interface CohortComparisonChartProps {
  groups: Group[];
  onSelectGroup?: (groupId: string) => void;
}

export const CohortComparisonChart: React.FC<CohortComparisonChartProps> = ({
  groups,
  onSelectGroup,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeGroup =
    groups.find((g) => g.id === hoveredId) ?? groups[0] ?? null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Cohort Readiness vs. Assessment Completion
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Side-by-side performance across all active student groups
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-blue-600" />
            Readiness Score
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-emerald-600" />
            Completion Rate
          </span>
        </div>
      </div>

      {activeGroup && (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-b border-slate-100 pb-3 text-xs dark:border-slate-800">
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {activeGroup.name}
          </span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-mono text-blue-600 tabular-nums dark:text-blue-400">
            Readiness {activeGroup.avgReadiness}%
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-mono text-emerald-700 tabular-nums dark:text-emerald-400">
            Completion {activeGroup.completionRate}%
          </span>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {groups.map((g) => {
          const shortLabel = g.name.split('—')[0].trim();
          const isActive = activeGroup?.id === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onMouseEnter={() => setHoveredId(g.id)}
              onFocus={() => setHoveredId(g.id)}
              onClick={() => onSelectGroup?.(g.id)}
              className={`flex flex-col items-center rounded-lg border p-3 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                isActive
                  ? 'border-blue-200 bg-slate-50 dark:border-blue-900 dark:bg-slate-800/70'
                  : 'border-slate-100 bg-white hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex h-32 w-full items-end justify-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-700">
                <div className="flex h-full flex-col items-center justify-end gap-1">
                  <span className="font-mono text-[10px] text-slate-500 tabular-nums dark:text-slate-400">
                    {g.avgReadiness}
                  </span>
                  <div
                    className="w-4 rounded-t-xs bg-blue-600 transition-all"
                    style={{ height: `${Math.max(12, g.avgReadiness)}%` }}
                  />
                </div>
                <div className="flex h-full flex-col items-center justify-end gap-1">
                  <span className="font-mono text-[10px] text-slate-500 tabular-nums dark:text-slate-400">
                    {g.completionRate}
                  </span>
                  <div
                    className="w-4 rounded-t-xs bg-emerald-600 transition-all"
                    style={{ height: `${Math.max(12, g.completionRate)}%` }}
                  />
                </div>
              </div>
              <span className="mt-2 w-full truncate text-center text-xs font-medium text-slate-700 dark:text-slate-300">
                {shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
