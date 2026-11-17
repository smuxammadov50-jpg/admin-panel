import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  ClipboardCheck,
  Compass,
  GraduationCap,
  Users,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { TrendAreaChart } from '../components/charts/TrendAreaChart';
import { CareerDistributionChart } from '../components/charts/CareerDistributionChart';
import { MONTHLY_TREND_DATA } from '../data/mockData';
import {
  computeCareerBreakdown,
  computeDashboardMetrics,
} from '../utils/adminLogic';
import type {
  CareerDirection,
  Group,
  PageKey,
  Student,
  TestResult,
} from '../types';

interface DashboardProps {
  students: Student[];
  groups: Group[];
  testResults: TestResult[];
  onNavigate: (page: PageKey) => void;
  onInspectResult: (result: TestResult) => void;
  onSelectCareerFilter: (direction: CareerDirection) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  groups,
  testResults,
  onNavigate,
  onInspectResult,
  onSelectCareerFilter,
}) => {
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'30d' | 'semester' | 'year'>('semester');
  const [selectedCareer, setSelectedCareer] = useState<CareerDirection | null>(
    null
  );

  const kpis = useMemo(
    () =>
      computeDashboardMetrics(
        students,
        groups,
        testResults,
        groupFilter,
        timeframe
      ),
    [students, groups, testResults, groupFilter, timeframe]
  );

  const careerBreakdown = useMemo(
    () => computeCareerBreakdown(students, groupFilter),
    [students, groupFilter]
  );

  const recentResults = useMemo(() => {
    return testResults
      .filter((r) => {
        const matchesGroup = groupFilter === 'all' || r.groupId === groupFilter;
        const matchesCareer =
          !selectedCareer || r.recommendedTrack === selectedCareer;
        return matchesGroup && matchesCareer;
      })
      .slice(0, 6);
  }, [testResults, groupFilter, selectedCareer]);

  const scopedGroups = useMemo(() => {
    return groupFilter === 'all'
      ? groups
      : groups.filter((g) => g.id === groupFilter);
  }, [groups, groupFilter]);

  const scaleFactor =
    groupFilter === 'all'
      ? timeframe === '30d'
        ? 0.45
        : timeframe === 'year'
          ? 1.35
          : 1
      : 0.25;

  return (
    <div className="space-y-6">
      {/* Page Title & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            School Performance Overview
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Student enrollment, assessment completion, and career pathway alignment
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            aria-label="Filter dashboard by group"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">All Cohorts ({groups.length})</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <div
            role="group"
            aria-label="Dashboard timeframe"
            className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
          >
            {(
              [
                { id: '30d', label: '30 Days' },
                { id: 'semester', label: 'Semester' },
                { id: 'year', label: 'Full Year' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTimeframe(opt.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  timeframe === opt.id
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-xs font-medium text-white whitespace-nowrap transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <span>Generate Report</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Five Statistic Cards in One Row on Desktop */}
      <section
        aria-label="Key Performance Metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <StatCard
          label="Total Students"
          value={kpis.totalStudents}
          subtext={kpis.activeStudentsDelta}
          icon={Users}
          onClick={() => onNavigate('students')}
        />
        <StatCard
          label="Active Groups"
          value={kpis.activeGroups}
          subtext={kpis.groupsSubtext}
          icon={GraduationCap}
          onClick={() => onNavigate('groups')}
        />
        <StatCard
          label="Assessments Completed"
          value={kpis.assessmentsCompleted}
          subtext={kpis.assessmentsDelta}
          icon={ClipboardCheck}
          tone="positive"
          onClick={() => onNavigate('test-results')}
        />
        <StatCard
          label="Avg. Readiness Score"
          value={`${kpis.avgReadinessScore}%`}
          subtext={kpis.readinessDelta}
          icon={Award}
          tone="accent"
          onClick={() => onNavigate('analytics')}
        />
        <StatCard
          label="Career Paths Matched"
          value={kpis.careerMatchedCount}
          subtext={`${kpis.careerMatchedRate}% of cohort decided`}
          icon={Compass}
          tone="positive"
          onClick={() => onNavigate('analytics')}
        />
      </section>

      {/* Two-Column Chart Layout */}
      <section
        aria-label="Performance Charts"
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <TrendAreaChart
            data={MONTHLY_TREND_DATA}
            scaleFactor={scaleFactor}
          />
        </div>
        <div className="lg:col-span-5">
          <CareerDistributionChart
            items={careerBreakdown}
            selectedDirection={selectedCareer}
            onSelectDirection={setSelectedCareer}
          />
        </div>
      </section>

      {/* Recent Assessments & Cohort Progress */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Submissions */}
        <div className="rounded-xl border border-slate-200 bg-white lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Recent Assessment Activity
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {selectedCareer
                  ? `Filtered by track: ${selectedCareer}`
                  : 'Latest completed and pending evaluations'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('test-results')}
              className="text-xs font-medium text-blue-600 hover:underline whitespace-nowrap dark:text-blue-400"
            >
              View all results
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentResults.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No assessments match the active cohort and track filter.
              </div>
            ) : (
              recentResults.map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => onInspectResult(res)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {res.studentName}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {res.testTitle} · {res.submittedDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                      {res.score}%
                    </span>
                    <StatusBadge status={res.status} />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Cohort Readiness Summary */}
        <div className="rounded-xl border border-slate-200 bg-white lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Cohort Readiness Benchmarks
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Completion and readiness across groups
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('groups')}
              className="text-xs font-medium text-blue-600 hover:underline whitespace-nowrap dark:text-blue-400"
            >
              Manage groups
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {scopedGroups.map((g) => (
              <div key={g.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-medium text-slate-900 dark:text-slate-100">
                    {g.name}
                  </span>
                  <span className="font-mono font-semibold text-slate-700 tabular-nums shrink-0 dark:text-slate-300">
                    {g.avgReadiness}% readiness
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-sm bg-blue-600"
                    style={{ width: `${g.avgReadiness}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{g.advisor}</span>
                  <span className="font-mono tabular-nums">
                    {g.completionRate}% tests complete
                  </span>
                </div>
              </div>
            ))}
          </div>

          {selectedCareer && (
            <div className="border-t border-slate-200 px-5 py-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  onSelectCareerFilter(selectedCareer);
                  onNavigate('students');
                }}
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Inspect all students in {selectedCareer} →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
