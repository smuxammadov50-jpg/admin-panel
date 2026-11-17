import React, { useMemo, useState } from 'react';
import { ArrowUpDown, Plus, Search } from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import {
  CAREER_DIRECTIONS,
  filterStudents,
  paginateItems,
  sortStudents,
  type StudentSortKey,
} from '../utils/adminLogic';
import type {
  CareerDirection,
  Group,
  Student,
  StudentStatus,
} from '../types';

interface StudentsProps {
  students: Student[];
  groups: Group[];
  initialSearch?: string;
  initialCareerFilter?: 'All' | CareerDirection;
  tableDensity?: 'comfortable' | 'compact';
  onOpenAddStudent: () => void;
  onSelectStudent: (student: Student) => void;
}

export const Students: React.FC<StudentsProps> = ({
  students,
  groups,
  initialSearch = '',
  initialCareerFilter = 'All',
  tableDensity = 'comfortable',
  onOpenAddStudent,
  onSelectStudent,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [groupId, setGroupId] = useState('all');
  const [status, setStatus] = useState<'All' | StudentStatus>('All');
  const [careerDirection, setCareerDirection] = useState<'All' | CareerDirection>(
    initialCareerFilter
  );
  const [sortBy, setSortBy] = useState<StudentSortKey>('lastActiveDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const filtered = useMemo(
    () =>
      filterStudents(students, {
        search,
        groupId,
        status,
        careerDirection,
      }),
    [students, search, groupId, status, careerDirection]
  );

  const sorted = useMemo(
    () => sortStudents(filtered, sortBy, sortDir),
    [filtered, sortBy, sortDir]
  );

  const paged = useMemo(
    () => paginateItems(sorted, page, pageSize),
    [sorted, page, pageSize]
  );

  const toggleSort = (key: StudentSortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
    setPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setGroupId('all');
    setStatus('All');
    setCareerDirection('All');
    setPage(1);
  };

  const rowPad = tableDensity === 'compact' ? 'py-2' : 'py-3';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Students Directory
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {filtered.length} of {students.length} students shown · Click any row to manage status or career track
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddStudent}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-medium text-white whitespace-nowrap transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <Plus className="h-4 w-4" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            aria-label="Search students by name, ID, or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, ID, or email..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <select
          aria-label="Filter by group"
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

        <select
          aria-label="Filter by student status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as 'All' | StudentStatus);
            setPage(1);
          }}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Needs Review">Needs Review</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          aria-label="Filter by career direction"
          value={careerDirection}
          onChange={(e) => {
            setCareerDirection(e.target.value as 'All' | CareerDirection);
            setPage(1);
          }}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="All">All Career Tracks</option>
          {CAREER_DIRECTIONS.map((dir) => (
            <option key={dir} value={dir}>
              {dir}
            </option>
          ))}
        </select>
      </div>

      {/* Empty State or Table / Mobile List */}
      {paged.totalItems === 0 ? (
        <EmptyState
          title="No students match your filters"
          description="Try clearing the search query or widening the group, status, or career track filter."
          actionLabel="Reset Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {/* Desktop / Tablet Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('name')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      <span>Student</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3">Cohort</th>
                  <th className="px-4 py-3">Career Track</th>
                  <th className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleSort('gpa')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      <span>GPA</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleSort('attendanceRate')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      <span>Attendance</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleSort('readinessScore')}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      <span>Readiness</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paged.items.map((stu) => (
                  <tr
                    key={stu.id}
                    onClick={() => onSelectStudent(stu)}
                    className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className={`px-4 ${rowPad}`}>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {stu.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {stu.studentCode} · {stu.email}
                      </div>
                    </td>
                    <td className={`px-4 ${rowPad} text-slate-600 dark:text-slate-300`}>
                      {stu.groupName}
                    </td>
                    <td className={`px-4 ${rowPad} text-slate-700 dark:text-slate-300`}>
                      {stu.careerDirection}
                    </td>
                    <td
                      className={`px-4 ${rowPad} text-right font-mono font-medium text-slate-900 tabular-nums dark:text-slate-100`}
                    >
                      {stu.gpa.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 ${rowPad} text-right font-mono text-slate-600 tabular-nums dark:text-slate-300`}
                    >
                      {stu.attendanceRate}%
                    </td>
                    <td
                      className={`px-4 ${rowPad} text-right font-mono font-semibold text-blue-600 tabular-nums dark:text-blue-400`}
                    >
                      {stu.readinessScore}%
                    </td>
                    <td className={`px-4 ${rowPad}`}>
                      <StatusBadge status={stu.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dedicated Mobile Card View */}
          <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
            {paged.items.map((stu) => (
              <button
                key={stu.id}
                type="button"
                onClick={() => onSelectStudent(stu)}
                className="block w-full p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {stu.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {stu.studentCode} · {stu.groupName}
                    </div>
                  </div>
                  <StatusBadge status={stu.status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-400">GPA</span>
                    <div className="font-mono font-medium text-slate-900 tabular-nums dark:text-slate-100">
                      {stu.gpa.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Readiness</span>
                    <div className="font-mono font-semibold text-blue-600 tabular-nums dark:text-blue-400">
                      {stu.readinessScore}%
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Track</span>
                    <div className="truncate font-medium text-slate-700 dark:text-slate-300">
                      {stu.careerDirection}
                    </div>
                  </div>
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
