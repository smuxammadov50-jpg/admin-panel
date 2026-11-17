import React, { useState } from 'react';
import type { CareerDirection } from '../../types';

interface CareerItem {
  direction: CareerDirection;
  count: number;
  percentage: number;
  avgReadiness: number;
}

interface CareerDistributionChartProps {
  items: CareerItem[];
  selectedDirection?: CareerDirection | null;
  onSelectDirection?: (direction: CareerDirection | null) => void;
}

const BAR_COLORS: Record<CareerDirection, string> = {
  'Engineering & Tech': 'bg-blue-600',
  'Healthcare & Bio': 'bg-emerald-600',
  'Business & Finance': 'bg-indigo-500',
  'Arts & Media': 'bg-amber-500',
  'Social Sciences': 'bg-slate-600',
  Undecided: 'bg-slate-400',
};

export const CareerDistributionChart: React.FC<CareerDistributionChartProps> = ({
  items,
  selectedDirection = null,
  onSelectDirection,
}) => {
  const [hovered, setHovered] = useState<CareerDirection | null>(null);
  const maxCount = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Career Direction Distribution
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Student pathway alignment by cluster
          </p>
        </div>
        {selectedDirection && onSelectDirection && (
          <button
            type="button"
            onClick={() => onSelectDirection(null)}
            className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Clear selection
          </button>
        )}
      </div>

      <div className="mt-5 space-y-3.5">
        {items.map((item) => {
          const widthPct = Math.max(4, Math.round((item.count / maxCount) * 100));
          const isSelected = selectedDirection === item.direction;
          const isDimmed = selectedDirection !== null && !isSelected;

          return (
            <button
              key={item.direction}
              type="button"
              onClick={() =>
                onSelectDirection?.(isSelected ? null : item.direction)
              }
              onMouseEnter={() => setHovered(item.direction)}
              onMouseLeave={() => setHovered(null)}
              className={`block w-full rounded-lg p-1.5 text-left transition-opacity focus-visible:outline-2 focus-visible:outline-blue-600 ${
                isSelected
                  ? 'bg-slate-50 ring-1 ring-blue-500/40 dark:bg-slate-800/70'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              } ${isDimmed ? 'opacity-50' : 'opacity-100'}`}
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {item.direction}
                </span>
                <div className="flex items-center gap-2 font-mono text-slate-600 tabular-nums dark:text-slate-400">
                  <span>{item.count} students</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="w-9 text-right font-semibold text-slate-900 dark:text-slate-100">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-sm transition-all duration-200 ${
                    BAR_COLORS[item.direction]
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>

              {hovered === item.direction && (
                <div className="mt-1 text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
                  Mean readiness in track: {item.avgReadiness}%
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
