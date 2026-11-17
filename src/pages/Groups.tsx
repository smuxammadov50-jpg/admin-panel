import React, { useMemo, useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import type { Group, Student } from '../types';

interface GroupsProps {
  groups: Group[];
  students: Student[];
  onOpenCreateGroup: () => void;
  onSelectGroup: (group: Group) => void;
}

export const Groups: React.FC<GroupsProps> = ({
  groups,
  students,
  onOpenCreateGroup,
  onSelectGroup,
}) => {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups.filter((g) => {
      if (
        q &&
        !g.name.toLowerCase().includes(q) &&
        !g.advisor.toLowerCase().includes(q) &&
        !g.track.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (gradeFilter !== 'All' && g.gradeLevel !== gradeFilter) {
        return false;
      }
      return true;
    });
  }, [groups, search, gradeFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Student Groups & Cohorts
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Manage cohort capacities, academic advisors, and group readiness benchmarks
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateGroup}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-medium text-white whitespace-nowrap transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <Plus className="h-4 w-4" />
          <span>Create Group</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            aria-label="Search groups by name, advisor, or track"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cohort, advisor, or track..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div
          role="group"
          aria-label="Filter by grade level"
          className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
        >
          {['All', 'Grade 10', 'Grade 11', 'Grade 12'].map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => setGradeFilter(grade)}
              className={`rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                gradeFilter === grade
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Group Cards Grid */}
      {filteredGroups.length === 0 ? (
        <EmptyState
          title="No cohorts found"
          description="No academic groups match the current search or grade filter."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setGradeFilter('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredGroups.map((g) => {
            const enrolled = students.filter((s) => s.groupId === g.id).length;
            const seatPct = Math.min(100, Math.round((enrolled / g.capacity) * 100));

            return (
              <div
                key={g.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {g.gradeLevel} · {g.track}
                  </div>
                  <h2 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                    {g.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Advisor: {g.advisor} · {g.room}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Enrolled
                    </div>
                    <div className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                      {enrolled}/{g.capacity}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Readiness
                    </div>
                    <div className="mt-0.5 font-mono text-sm font-semibold text-blue-600 tabular-nums dark:text-blue-400">
                      {g.avgReadiness}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Completion
                    </div>
                    <div className="mt-0.5 font-mono text-sm font-semibold text-emerald-700 tabular-nums dark:text-emerald-400">
                      {g.completionRate}%
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-sm bg-slate-700 dark:bg-slate-400"
                      style={{ width: `${seatPct}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {seatPct}% seat utilization
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectGroup(g)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>View Roster</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
