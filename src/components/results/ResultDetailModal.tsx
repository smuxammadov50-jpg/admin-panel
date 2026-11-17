import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import type { TestResult, TestStatus } from '../../types';

interface ResultDetailModalProps {
  result: TestResult | null;
  onClose: () => void;
  onUpdateStatus: (resultId: string, status: TestStatus) => void;
}

export const ResultDetailModal: React.FC<ResultDetailModalProps> = ({
  result,
  onClose,
  onUpdateStatus,
}) => {
  if (!result) return null;

  return (
    <Modal
      open={Boolean(result)}
      onClose={onClose}
      title={result.testTitle}
      subtitle={`${result.studentName} · ${result.groupName} · Submitted ${result.submittedDate}`}
      maxWidthClass="max-w-lg"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Composite Score
            </div>
            <div className="mt-1 font-mono text-2xl font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {result.score}
              <span className="text-sm font-normal text-slate-400">
                /{result.maxScore}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Recommended Track
            </div>
            <div className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              {result.recommendedTrack}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Sub-Section Breakdown
          </h3>
          {result.sections.map((sec) => {
            const pct = Math.round((sec.score / sec.maxScore) * 100);
            return (
              <div key={sec.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300">
                    {sec.label}
                  </span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums dark:text-slate-100">
                    {sec.score}/{sec.maxScore} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-sm bg-blue-600"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
          <div className="font-semibold text-slate-800 dark:text-slate-200">
            Advisor Evaluation Notes
          </div>
          <p className="mt-1 leading-relaxed">{result.notes}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Status:
            </span>
            <StatusBadge status={result.status} />
          </div>

          <div className="flex items-center gap-2">
            {result.status !== 'Completed' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(result.id, 'Completed')}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
              >
                Mark Completed
              </button>
            )}
            {result.status === 'Completed' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(result.id, 'In Progress')}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Reopen Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
