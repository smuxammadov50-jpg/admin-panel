import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import type { StudentStatus, TestStatus } from '../../types';

interface StatusBadgeProps {
  status: StudentStatus | TestStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (status === 'Active' || status === 'Completed') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 whitespace-nowrap dark:bg-emerald-950/60 dark:text-emerald-300">
        <CheckCircle2 className="h-3 w-3 shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  if (status === 'Needs Review' || status === 'In Progress') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 whitespace-nowrap dark:bg-amber-950/60 dark:text-amber-300">
        <Clock className="h-3 w-3 shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 whitespace-nowrap dark:bg-rose-950/60 dark:text-rose-300">
      <AlertCircle className="h-3 w-3 shrink-0" />
      <span>{status}</span>
    </span>
  );
};
