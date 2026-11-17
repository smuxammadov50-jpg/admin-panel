import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { filterTestResults, paginateItems } from '../utils/adminLogic';
import type { Group, TestResult, TestStatus } from '../types';

interface TestResultsProps {
  results: TestResult[];
  groups: Group[];
  tableDensity?: 'comfortable' | 'compact';
  onSelectResult: (result: TestResult) => void;
}

export const TestResults: React.FC<TestResultsProps> = ({
  results,
  groups,
  tableDensity = 'comfortable',
  onSelectResult,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | TestResult['category']>('All');
  const [status, setStatus] = useState<'All' | TestStatus>('All');
  const [groupId, setGroupId] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const filtered = useMemo(
    () => filterTestResults(results, { search, category, status, groupId }),
    [results, search, category, status, groupId]
  );

  const paged = useMemo(
    () => paginateItems(filtered, page, pageSize),
    [filtered, page, pageSize]
  );

  const completedCount = filtered.filter((r) => r.status === 'Completed').length;
  const overdueCount = filtered.filter((r) => r.status === 'Overdue').length;
  const avgScore =
    filtered.length > 0
      ? Math.round(
          filtered.reduce((sum, r) => sum + r.score, 0) / filtered.length
        )
      : 0;

  const rowPad = tableDensity === 'compact' ? 'py-2' : 'py-3';

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Assessment & Test Results
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {filtered.length} records · {completedCount} completed · {overdueCount} overdue · Mean score{' '}
            <span className="font-mono font-semibold text-slate-800 tabular-nums dark:text-slate-200">
              {avgScore}%
            </span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            aria-label="Search test results by student or test title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search student or assessment..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <select
          aria-label="Filter by assessment category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as 'All' | TestResult['category']);
            setPage(1);
          }}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="All">All Categories</option>
          <option value="Career Aptitude">Career Aptitude</option>
          <option value="STEM Diagnostic">STEM Diagnostic</option>
          <option value="Academic Benchmark">Academic Benchmark</option>
          <option value="Leadership Eval">Leadership Eval</option>
        </select>

        <select
          aria-label="Filter by completion status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as 'All' | TestStatus);
            setPage(1);
          }}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select
          aria-label="Filter results by group"
          value={groupId}
          onChange={(e) => {
            setGroupId(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="all">All Cohorts</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {paged.totalItems === 0 ? (
        <EmptyState
          title="No assessment results found"
          description="Adjust your search query, assessment category, or status filter to view results."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('');
            setCategory('All');
            setStatus('All');
            setGroupId('all');
            setPage(1);
          }}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Assessment</th>
                  <th className="px-4 py-3">Recommended Track</th>
                  <th className="px-4 py-3 text-right">Duration</th>
                  <th className="px-4 py-3 text-right">Score</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paged.items.map((res) => (
                  <tr
                    key={res.id}
                    onClick={() => onSelectResult(res)}
                    className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className={`px-4 ${rowPad}`}>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {res.studentName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {res.groupName}
                      </div>
                    </td>
                    <td className={`px-4 ${rowPad}`}>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {res.testTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {res.category}
                      </div>
                    </td>
                    <td className={`px-4 ${rowPad} text-slate-700 dark:text-slate-300`}>
                      {res.recommendedTrack}
                    </td>
                    <td
                      className={`px-4 ${rowPad} text-right font-mono text-slate-600 tabular-nums dark:text-slate-400`}
                    >
                      {res.durationMinutes} min
                    </td>
                    <td
                      className={`px-4 ${rowPad} text-right font-mono font-semibold text-slate-900 tabular-nums dark:text-slate-100`}
                    >
                      {res.score}/{res.maxScore}
                    </td>
                    <td
                      className={`px-4 ${rowPad} font-mono text-slate-500 tabular-nums dark:text-slate-400`}
                    >
                      {res.submittedDate}
                    </td>
                    <td className={`px-4 ${rowPad}`}>
                      <StatusBadge status={res.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
            {paged.items.map((res) => (
              <button
                key={res.id}
                type="button"
                onClick={() => onSelectResult(res)}
                className="block w-full p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {res.studentName}
                    </div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {res.testTitle} · {res.submittedDate}
                    </div>
                  </div>
                  <StatusBadge status={res.status} />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>{res.recommendedTrack}</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                    {res.score}/{res.maxScore}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <Pagination
            currentPage={paged.currentPage}
            totalPages={paged.totalPages}
            totalItems={paged.totalItems}
            startIndex={paged.startIndex}
            endIndex={paged.endIndex}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
};
