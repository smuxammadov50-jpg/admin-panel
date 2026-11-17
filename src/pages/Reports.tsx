import React, { useMemo, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { buildReportData, generateCsvContent } from '../utils/adminLogic';
import type { Group, ReportType, Student, TestResult } from '../types';

interface ReportsProps {
  students: Student[];
  groups: Group[];
  testResults: TestResult[];
  schoolName: string;
  onNotify: (message: string) => void;
}

const REPORT_TABS: Array<{ id: ReportType; label: string }> = [
  { id: 'overview', label: 'School Performance' },
  { id: 'students', label: 'Student Statistics' },
  { id: 'test-completion', label: 'Test Completion' },
  { id: 'career-direction', label: 'Career Direction' },
];

export const Reports: React.FC<ReportsProps> = ({
  students,
  groups,
  testResults,
  schoolName,
  onNotify,
}) => {
  const [reportType, setReportType] = useState<ReportType>('overview');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-11-16');
  const [groupId, setGroupId] = useState('all');

  const report = useMemo(
    () =>
      buildReportData(students, groups, testResults, {
        reportType,
        startDate,
        endDate,
        groupId,
      }),
    [students, groups, testResults, reportType, startDate, endDate, groupId]
  );

  const applyPreset = (preset: '30d' | 'quarter' | 'year') => {
    if (preset === '30d') {
      setStartDate('2026-10-17');
      setEndDate('2026-11-16');
    } else if (preset === 'quarter') {
      setStartDate('2026-09-01');
      setEndDate('2026-11-16');
    } else {
      setStartDate('2026-01-01');
      setEndDate('2026-11-16');
    }
  };

  const handleExportCsv = () => {
    const csv = generateCsvContent(report.headers, report.rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meridian-${reportType}-${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify(`Exported ${report.rows.length} rows to CSV (${report.title}).`);
  };

  const handleExportPdf = () => {
    onNotify('Opening print-formatted PDF report view.');
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Institutional Reports
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {schoolName} · Filter by report category, cohort, and date range to export CSV or PDF
          </p>
        </div>

        <div className="no-print flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={report.rows.length === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selector & Date Filters */}
      <div className="no-print space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div
          role="tablist"
          aria-label="Report categories"
          className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
        >
          {REPORT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={reportType === tab.id}
              onClick={() => setReportType(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                reportType === tab.id
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="report-start"
              className="block text-[11px] font-medium text-slate-500 dark:text-slate-400"
            >
              Start Date
            </label>
            <input
              id="report-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="report-end"
              className="block text-[11px] font-medium text-slate-500 dark:text-slate-400"
            >
              End Date
            </label>
            <input
              id="report-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="report-group"
              className="block text-[11px] font-medium text-slate-500 dark:text-slate-400"
            >
              Cohort Scope
            </label>
            <select
              id="report-group"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">All Cohorts</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <span className="mb-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Quick Presets
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('30d')}
                className="h-9 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                30D
              </button>
              <button
                type="button"
                onClick={() => applyPreset('quarter')}
                className="h-9 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Fall Term
              </button>
              <button
                type="button"
                onClick={() => applyPreset('year')}
                className="h-9 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                YTD
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {report.summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {card.label}
            </div>
            <div className="mt-2 truncate font-mono text-xl font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Table */}
      {report.rows.length === 0 ? (
        <EmptyState
          title="No records in selected date range"
          description="Widen your start and end dates or select All Cohorts to populate this report."
          actionLabel="Reset to Fall Term"
          onAction={() => {
            applyPreset('quarter');
            setGroupId('all');
          }}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {report.title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {report.subtitle}
            </p>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  {report.headers.map((header) => (
                    <th key={header} className="px-4 py-3 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {report.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-4 py-3 ${
                          cIdx === 0
                            ? 'font-medium text-slate-900 dark:text-slate-100'
                            : 'text-slate-600 tabular-nums dark:text-slate-300'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Report Cards */}
          <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
            {report.rows.map((row, idx) => (
              <div key={idx} className="space-y-1.5 p-4 text-xs">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {row[0]}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {report.headers.slice(1).map((hdr, hIdx) => (
                    <div key={hdr}>
                      <span className="text-[11px] text-slate-400">{hdr}</span>
                      <div className="font-medium text-slate-700 tabular-nums dark:text-slate-300">
                        {row[hIdx + 1]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
