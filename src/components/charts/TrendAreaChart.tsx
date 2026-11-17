import React, { useState } from 'react';
import type { MonthlyTrendPoint } from '../../types';

interface TrendAreaChartProps {
  data: MonthlyTrendPoint[];
  scaleFactor?: number;
}

export const TrendAreaChart: React.FC<TrendAreaChartProps> = ({
  data,
  scaleFactor = 1,
}) => {
  const [metric, setMetric] = useState<'completions' | 'avgScore'>('completions');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(data.length - 1);

  const scaledData = data.map((d) => ({
    ...d,
    completions: Math.max(2, Math.round(d.completions * scaleFactor)),
    targetCompletions: Math.max(2, Math.round(d.targetCompletions * scaleFactor)),
  }));

  const width = 560;
  const height = 220;
  const padLeft = 36;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 32;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const values = scaledData.map((d) =>
    metric === 'completions' ? d.completions : d.avgScore
  );
  const maxVal =
    metric === 'completions'
      ? Math.max(...scaledData.map((d) => Math.max(d.completions, d.targetCompletions)), 10) * 1.15
      : 100;
  const minVal = metric === 'completions' ? 0 : 60;

  const getX = (idx: number) =>
    padLeft + (idx / Math.max(1, scaledData.length - 1)) * plotW;

  const getY = (val: number) =>
    padTop + plotH - ((val - minVal) / Math.max(1, maxVal - minVal)) * plotH;

  const linePoints = scaledData
    .map((d, i) => `${getX(i).toFixed(1)},${getY(values[i]).toFixed(1)}`)
    .join(' ');

  const areaPath =
    scaledData.length > 0
      ? `M ${getX(0).toFixed(1)} ${(padTop + plotH).toFixed(1)} ` +
        scaledData
          .map((d, i) => `L ${getX(i).toFixed(1)} ${getY(values[i]).toFixed(1)}`)
          .join(' ') +
        ` L ${getX(scaledData.length - 1).toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`
      : '';

  const targetPoints = scaledData
    .map((d, i) => `${getX(i).toFixed(1)},${getY(d.targetCompletions).toFixed(1)}`)
    .join(' ');

  const gridTicks =
    metric === 'completions'
      ? [0, Math.round(maxVal * 0.33), Math.round(maxVal * 0.66), Math.round(maxVal)]
      : [60, 75, 90, 100];

  const activeIndex = hoveredIdx ?? scaledData.length - 1;
  const activePoint = scaledData[activeIndex];

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Assessment Velocity & Readiness
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Monthly progression across active cohorts
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Chart metric"
          className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
        >
          <button
            type="button"
            role="tab"
            aria-selected={metric === 'completions'}
            onClick={() => setMetric('completions')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
              metric === 'completions'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Completions
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={metric === 'avgScore'}
            onClick={() => setMetric('avgScore')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
              metric === 'avgScore'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Readiness Score
          </button>
        </div>
      </div>

      {activePoint && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {activePoint.month} 2026
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="font-mono font-semibold text-blue-600 tabular-nums dark:text-blue-400">
              {metric === 'completions'
                ? `${activePoint.completions} completed`
                : `${activePoint.avgScore}% readiness`}
            </span>
            {metric === 'completions' && (
              <>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="font-mono text-slate-500 tabular-nums dark:text-slate-400">
                  Target {activePoint.targetCompletions}
                </span>
              </>
            )}
          </div>
          <span className="text-slate-400 dark:text-slate-500">
            Hover points to inspect month
          </span>
        </div>
      )}

      <div className="mt-3 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-56 w-full overflow-visible"
          role="img"
          aria-label={`Monthly ${metric === 'completions' ? 'assessment completions' : 'average readiness score'} trend chart`}
        >
          <defs>
            <linearGradient id="meridianTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {gridTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 font-mono text-[10px] tabular-nums dark:fill-slate-500"
                >
                  {metric === 'avgScore' ? `${tick}%` : tick}
                </text>
              </g>
            );
          })}

          {areaPath && <path d={areaPath} fill="url(#meridianTrendFill)" />}

          {metric === 'completions' && (
            <polyline
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              points={targetPoints}
            />
          )}

          <polyline
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints}
          />

          {scaledData.map((d, idx) => {
            const cx = getX(idx);
            const cy = getY(values[idx]);
            const isActive = idx === activeIndex;
            return (
              <g key={d.month}>
                {isActive && (
                  <line
                    x1={cx}
                    y1={padTop}
                    x2={cx}
                    y2={padTop + plotH}
                    className="stroke-blue-200 dark:stroke-blue-900"
                    strokeWidth="1.5"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 5 : 3.5}
                  className={
                    isActive
                      ? 'fill-blue-600 stroke-white dark:stroke-slate-900'
                      : 'fill-white stroke-blue-600 dark:fill-slate-900'
                  }
                  strokeWidth="2"
                />
                <text
                  x={cx}
                  y={height - 8}
                  textAnchor="middle"
                  className={`text-[11px] font-medium ${
                    isActive
                      ? 'fill-slate-900 dark:fill-slate-100'
                      : 'fill-slate-500 dark:fill-slate-400'
                  }`}
                >
                  {d.month}
                </text>
                <rect
                  x={cx - plotW / (scaledData.length * 2)}
                  y={padTop}
                  width={plotW / scaledData.length}
                  height={plotH + padBottom}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onFocus={() => setHoveredIdx(idx)}
                  onClick={() => setHoveredIdx(idx)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
