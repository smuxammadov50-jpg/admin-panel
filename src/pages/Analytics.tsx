import React, { useMemo, useState } from 'react';
import { CohortComparisonChart } from '../components/charts/CohortComparisonChart';
import { CareerDistributionChart } from '../components/charts/CareerDistributionChart';
import { TrendAreaChart } from '../components/charts/TrendAreaChart';
import { MONTHLY_TREND_DATA } from '../data/mockData';
import { computeCareerBreakdown } from '../utils/adminLogic';
import type { CareerDirection, Group, Student, TestResult } from '../types';

interface AnalyticsProps {
  students: Student[];
  groups: Group[];
  testResults: TestResult[];
  onNavigateToReports: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  students,
  groups,
  testResults,
  onNavigateToReports,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [selectedCareer, setSelectedCareer] = useState<CareerDirection | null>(
    null
  );

  const careerBreakdown = useMemo(
    () => computeCareerBreakdown(students, selectedGroupId),
    [students, selectedGroupId]
  );

  const gradeStats = useMemo(() => {
    const grades = ['Grade 10', 'Grade 11', 'Grade 12'];
    return grades.map((grade) => {
      const list = students.filter((s) => s.grade === grade);
      const count = list.length;
      const avgGpa =
        count > 0
          ? (list.reduce((sum, s) => sum + s.gpa, 0) / count).toFixed(2)
          : '0.00';
      const avgReadiness =
        count > 0
          ? Math.round(
              list.reduce((sum, s) => sum + s.readinessScore, 0) / count
            )
          : 0;
      const avgAttendance =
        count > 0
          ? Math.round(
              list.reduce((sum, s) => sum + s.attendanceRate, 0) / count
            )
          : 0;
      const needsReview = list.filter((s) => s.status === 'Needs Review').length;
      return { grade, count, avgGpa, avgReadiness, avgAttendance, needsReview };
    });
  }, [students]);

  const categoryPerformance = useMemo(() => {
    const categories: TestResult['category'][] = [
      'Career Aptitude',
      'STEM Diagnostic',
      'Academic Benchmark',
      'Leadership Eval',
    ];
    return categories.map((cat) => {
      const matching = testResults.filter(
        (r) =>
          r.category === cat &&
          (selectedGroupId === 'all' || r.groupId === selectedGroupId)
      );
      const avgScore =
        matching.length > 0
          ? Math.round(
              matching.reduce((sum, r) => sum + r.score, 0) / matching.length
            )
          : 0;
      const completed = matching.filter((r) => r.status === 'Completed').length;
      return {
        category: cat,
        count: matching.length,
        avgScore,
        completionPct:
          matching.length > 0
            ? Math.round((completed / matching.length) * 100)
            : 0,
      };
    });
  }, [testResults, selectedGroupId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Academic & Career Analytics
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Cross-cohort readiness benchmarks, grade progression, and assessment diagnostics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            aria-label="Scope analytics to cohort"
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">All School Cohorts</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onNavigateToReports}
            className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Export Reports
          </button>
        </div>
      </div>

      {/* Cohort Comparison */}
      <CohortComparisonChart
        groups={groups}
        onSelectGroup={(id) =>
          setSelectedGroupId((prev) => (prev === id ? 'all' : id))
        }
      />

      {/* Two-Column Trend & Career Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <TrendAreaChart
            data={MONTHLY_TREND_DATA}
            scaleFactor={selectedGroupId === 'all' ? 1 : 0.28}
          />
        </div>
        <div className="lg:col-span-5">
          <CareerDistributionChart
            items={careerBreakdown}
            selectedDirection={selectedCareer}
            onSelectDirection={setSelectedCareer}
          />
        </div>
      </div>

      {/* Grade-Level & Assessment Category Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Grade-Level Standing Matrix
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3 text-right">Students</th>
                  <th className="px-4 py-3 text-right">Mean GPA</th>
                  <th className="px-4 py-3 text-right">Attendance</th>
                  <th className="px-4 py-3 text-right">Readiness</th>
                  <th className="px-4 py-3 text-right">Review Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gradeStats.map((row) => (
                  <tr key={row.grade}>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {row.grade}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {row.count}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {row.avgGpa}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {row.avgAttendance}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                      {row.avgReadiness}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-amber-700 dark:text-amber-400">
                      {row.needsReview}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Diagnostic Category Breakdown
            </h2>
          </div>
          <div className="divide-y divide-slate-100 p-4 dark:divide-slate-800">
            {categoryPerformance.map((cat) => (
              <div key={cat.category} className="py-3 first:pt-1 last:pb-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {cat.category}
                  </span>
                  <div className="flex items-center gap-3 font-mono tabular-nums">
                    <span className="text-slate-500 dark:text-slate-400">
                      {cat.count} logged
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {cat.avgScore}% avg
                    </span>
                  </div>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-sm bg-emerald-600"
                    style={{ width: `${cat.completionPct}%` }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
                  {cat.completionPct}% completion rate in selected scope
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
