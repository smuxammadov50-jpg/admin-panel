import type {
  CareerDirection,
  DashboardKPIs,
  Group,
  ReportConfig,
  Student,
  StudentFilters,
  TestResult,
  TestResultFilters,
} from '../types';

export const CAREER_DIRECTIONS: CareerDirection[] = [
  'Engineering & Tech',
  'Healthcare & Bio',
  'Business & Finance',
  'Arts & Media',
  'Social Sciences',
  'Undecided',
];

export function computeDashboardMetrics(
  students: Student[],
  groups: Group[],
  testResults: TestResult[],
  groupFilter: string = 'all',
  timeframe: '30d' | 'semester' | 'year' = 'semester'
): DashboardKPIs {
  const scopedStudents =
    groupFilter === 'all'
      ? students
      : students.filter((s) => s.groupId === groupFilter);

  const scopedGroups =
    groupFilter === 'all'
      ? groups
      : groups.filter((g) => g.id === groupFilter);

  const cutoffByTimeframe: Record<'30d' | 'semester' | 'year', string> = {
    '30d': '2026-10-17',
    semester: '2026-08-01',
    year: '2026-01-01',
  };
  const cutoff = cutoffByTimeframe[timeframe];

  const scopedResults = testResults.filter((r) => {
    const matchesGroup = groupFilter === 'all' || r.groupId === groupFilter;
    const matchesDate = r.submittedDate >= cutoff;
    return matchesGroup && matchesDate;
  });

  const completedInScope = scopedResults.filter((r) => r.status === 'Completed');

  const totalAssignedTests = scopedStudents.reduce(
    (sum, s) => sum + s.testsAssigned,
    0
  );
  const totalCompletedByStudents = scopedStudents.reduce(
    (sum, s) => sum + s.testsCompleted,
    0
  );

  // Use student aggregates for broader term/year views, or scoped completed tests
  const assessmentsCompleted =
    timeframe === '30d'
      ? completedInScope.length
      : Math.max(totalCompletedByStudents, completedInScope.length);

  const completionPct =
    totalAssignedTests > 0
      ? Math.round((totalCompletedByStudents / totalAssignedTests) * 100)
      : 0;

  const avgReadinessScore =
    scopedStudents.length > 0
      ? Math.round(
          scopedStudents.reduce((sum, s) => sum + s.readinessScore, 0) /
            scopedStudents.length
        )
      : 0;

  const careerMatchedCount = scopedStudents.filter(
    (s) => s.careerDirection !== 'Undecided'
  ).length;
  const careerMatchedRate =
    scopedStudents.length > 0
      ? Math.round((careerMatchedCount / scopedStudents.length) * 100)
      : 0;

  const activeCount = scopedStudents.filter((s) => s.status === 'Active').length;

  return {
    totalStudents: scopedStudents.length,
    activeStudentsDelta: `${activeCount} active in cohort`,
    activeGroups: scopedGroups.length,
    groupsSubtext: `${scopedGroups.reduce((sum, g) => sum + g.capacity, 0)} total seats`,
    assessmentsCompleted,
    assessmentsDelta: `${completionPct}% overall completion`,
    avgReadinessScore,
    readinessDelta: timeframe === '30d' ? '+3.4 pts vs prior 30d' : '+4.8 pts vs Q2',
    careerMatchedCount,
    careerMatchedRate,
  };
}

export function computeCareerBreakdown(
  students: Student[],
  groupFilter: string = 'all'
): Array<{
  direction: CareerDirection;
  count: number;
  percentage: number;
  avgReadiness: number;
}> {
  const scoped =
    groupFilter === 'all'
      ? students
      : students.filter((s) => s.groupId === groupFilter);

  const total = scoped.length;
  return CAREER_DIRECTIONS.map((direction) => {
    const matched = scoped.filter((s) => s.careerDirection === direction);
    const count = matched.length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    const avgReadiness =
      count > 0
        ? Math.round(
            matched.reduce((sum, s) => sum + s.readinessScore, 0) / count
          )
        : 0;
    return { direction, count, percentage, avgReadiness };
  }).sort((a, b) => b.count - a.count);
}

export function filterStudents(
  students: Student[],
  filters: StudentFilters
): Student[] {
  const q = filters.search.trim().toLowerCase();
  return students.filter((s) => {
    if (
      q &&
      !s.name.toLowerCase().includes(q) &&
      !s.studentCode.toLowerCase().includes(q) &&
      !s.email.toLowerCase().includes(q) &&
      !s.groupName.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (filters.groupId !== 'all' && s.groupId !== filters.groupId) {
      return false;
    }
    if (filters.status !== 'All' && s.status !== filters.status) {
      return false;
    }
    if (
      filters.careerDirection !== 'All' &&
      s.careerDirection !== filters.careerDirection
    ) {
      return false;
    }
    return true;
  });
}

export type StudentSortKey = 'name' | 'gpa' | 'readinessScore' | 'attendanceRate' | 'lastActiveDate';

export function sortStudents(
  students: Student[],
  sortBy: StudentSortKey,
  sortDir: 'asc' | 'desc'
): Student[] {
  const copy = [...students];
  copy.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name' || sortBy === 'lastActiveDate') {
      cmp = a[sortBy].localeCompare(b[sortBy]);
    } else {
      cmp = a[sortBy] - b[sortBy];
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });
  return copy;
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number
): {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  startIndex: number;
  endIndex: number;
} {
  const safeSize = Math.max(1, pageSize);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safeSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * safeSize;
  const sliced = items.slice(start, start + safeSize);

  return {
    items: sliced,
    totalItems,
    totalPages,
    currentPage,
    startIndex: totalItems === 0 ? 0 : start + 1,
    endIndex: start + sliced.length,
  };
}

export function filterTestResults(
  results: TestResult[],
  filters: TestResultFilters
): TestResult[] {
  const q = filters.search.trim().toLowerCase();
  return results.filter((r) => {
    if (
      q &&
      !r.studentName.toLowerCase().includes(q) &&
      !r.testTitle.toLowerCase().includes(q) &&
      !r.groupName.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (filters.category !== 'All' && r.category !== filters.category) {
      return false;
    }
    if (filters.status !== 'All' && r.status !== filters.status) {
      return false;
    }
    if (filters.groupId !== 'all' && r.groupId !== filters.groupId) {
      return false;
    }
    return true;
  });
}

export interface BuiltReport {
  title: string;
  subtitle: string;
  summaryCards: Array<{ label: string; value: string }>;
  headers: string[];
  rows: string[][];
}

export function buildReportData(
  students: Student[],
  groups: Group[],
  testResults: TestResult[],
  config: ReportConfig
): BuiltReport {
  const scopedStudents =
    config.groupId === 'all'
      ? students
      : students.filter((s) => s.groupId === config.groupId);

  const scopedResults = testResults.filter((r) => {
    const inGroup = config.groupId === 'all' || r.groupId === config.groupId;
    const afterStart = !config.startDate || r.submittedDate >= config.startDate;
    const beforeEnd = !config.endDate || r.submittedDate <= config.endDate;
    return inGroup && afterStart && beforeEnd;
  });

  if (config.reportType === 'overview') {
    const targetGroups =
      config.groupId === 'all'
        ? groups
        : groups.filter((g) => g.id === config.groupId);

    const avgGpa =
      scopedStudents.length > 0
        ? (
            scopedStudents.reduce((sum, s) => sum + s.gpa, 0) /
            scopedStudents.length
          ).toFixed(2)
        : '0.00';

    const avgReadiness =
      scopedStudents.length > 0
        ? Math.round(
            scopedStudents.reduce((sum, s) => sum + s.readinessScore, 0) /
              scopedStudents.length
          )
        : 0;

    return {
      title: 'School Performance Overview',
      subtitle: `Cohort benchmarks and academic readiness (${config.startDate || 'Start'} to ${config.endDate || 'Present'})`,
      summaryCards: [
        { label: 'Cohorts Evaluated', value: String(targetGroups.length) },
        { label: 'Enrolled Students', value: String(scopedStudents.length) },
        { label: 'Mean GPA', value: avgGpa },
        { label: 'Mean Readiness', value: `${avgReadiness}%` },
      ],
      headers: [
        'Group Name',
        'Advisor',
        'Enrolled',
        'Avg Readiness',
        'Completion Rate',
        'Track',
      ],
      rows: targetGroups.map((g) => {
        const count = students.filter((s) => s.groupId === g.id).length;
        return [
          g.name,
          g.advisor,
          `${count} / ${g.capacity}`,
          `${g.avgReadiness}%`,
          `${g.completionRate}%`,
          g.track,
        ];
      }),
    };
  }

  if (config.reportType === 'students') {
    const filteredByDate = scopedStudents.filter((s) => {
      const afterStart = !config.startDate || s.lastActiveDate >= config.startDate;
      const beforeEnd = !config.endDate || s.lastActiveDate <= config.endDate;
      return afterStart && beforeEnd;
    });

    const activeRate =
      filteredByDate.length > 0
        ? Math.round(
            (filteredByDate.filter((s) => s.status === 'Active').length /
              filteredByDate.length) *
              100
          )
        : 0;

    const avgAttendance =
      filteredByDate.length > 0
        ? Math.round(
            filteredByDate.reduce((sum, s) => sum + s.attendanceRate, 0) /
              filteredByDate.length
          )
        : 0;

    return {
      title: 'Student Statistics Report',
      subtitle: `Individual academic standing, attendance, and assessment progress`,
      summaryCards: [
        { label: 'Matched Students', value: String(filteredByDate.length) },
        { label: 'Active Standing', value: `${activeRate}%` },
        { label: 'Mean Attendance', value: `${avgAttendance}%` },
        {
          label: 'Needs Review',
          value: String(
            filteredByDate.filter((s) => s.status === 'Needs Review').length
          ),
        },
      ],
      headers: [
        'Student ID',
        'Name',
        'Group',
        'GPA',
        'Attendance',
        'Readiness',
        'Status',
      ],
      rows: filteredByDate.map((s) => [
        s.studentCode,
        s.name,
        s.groupName,
        s.gpa.toFixed(2),
        `${s.attendanceRate}%`,
        `${s.readinessScore}%`,
        s.status,
      ]),
    };
  }

  if (config.reportType === 'test-completion') {
    const completed = scopedResults.filter((r) => r.status === 'Completed').length;
    const overdue = scopedResults.filter((r) => r.status === 'Overdue').length;
    const avgScore =
      scopedResults.length > 0
        ? Math.round(
            scopedResults.reduce((sum, r) => sum + r.score, 0) /
              scopedResults.length
          )
        : 0;

    return {
      title: 'Test Completion Report',
      subtitle: `Assessment turnaround, scores, and completion status by submission date`,
      summaryCards: [
        { label: 'Assessments Logged', value: String(scopedResults.length) },
        { label: 'Completed', value: String(completed) },
        { label: 'Overdue', value: String(overdue) },
        { label: 'Average Score', value: `${avgScore}%` },
      ],
      headers: [
        'Student',
        'Assessment',
        'Category',
        'Score',
        'Duration',
        'Date',
        'Status',
      ],
      rows: scopedResults.map((r) => [
        r.studentName,
        r.testTitle,
        r.category,
        `${r.score}/${r.maxScore}`,
        `${r.durationMinutes} min`,
        r.submittedDate,
        r.status,
      ]),
    };
  }

  // career-direction
  const breakdown = computeCareerBreakdown(scopedStudents, config.groupId);
  const topTrack = breakdown[0]?.direction ?? 'N/A';
  const decidedCount = scopedStudents.filter(
    (s) => s.careerDirection !== 'Undecided'
  ).length;

  return {
    title: 'Career Direction Report',
    subtitle: `Student pathway distribution and readiness alignment across career clusters`,
    summaryCards: [
      { label: 'Evaluated Students', value: String(scopedStudents.length) },
      { label: 'Pathway Matched', value: String(decidedCount) },
      { label: 'Top Career Track', value: topTrack },
      {
        label: 'Undecided',
        value: String(scopedStudents.length - decidedCount),
      },
    ],
    headers: [
      'Career Direction',
      'Students',
      'Cohort Share',
      'Avg Readiness',
    ],
    rows: breakdown.map((b) => [
      b.direction,
      String(b.count),
      `${b.percentage}%`,
      `${b.avgReadiness}%`,
    ]),
  };
}

function escapeCsvCell(value: string): string {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateCsvContent(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(escapeCsvCell).join(',');
  const dataLines = rows.map((row) => row.map(escapeCsvCell).join(','));
  return [headerLine, ...dataLines].join('\r\n');
}

export interface StudentFormInput {
  name: string;
  email: string;
  groupId: string;
  gpa: string;
  careerDirection: CareerDirection;
}

export function validateStudentForm(
  input: StudentFormInput
): Partial<Record<keyof StudentFormInput, string>> {
  const errors: Partial<Record<keyof StudentFormInput, string>> = {};
  if (!input.name.trim() || input.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }
  if (!input.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = 'Enter a valid academic email address.';
  }
  if (!input.groupId.trim()) {
    errors.groupId = 'Select an assigned cohort group.';
  }
  const gpaNum = Number(input.gpa);
  if (input.gpa.trim() === '' || Number.isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
    errors.gpa = 'GPA must be between 0.00 and 4.00.';
  }
  return errors;
}

export interface GroupFormInput {
  name: string;
  gradeLevel: string;
  track: string;
  advisor: string;
  room: string;
  capacity: string;
}

export function validateGroupForm(
  input: GroupFormInput
): Partial<Record<keyof GroupFormInput, string>> {
  const errors: Partial<Record<keyof GroupFormInput, string>> = {};
  if (!input.name.trim()) {
    errors.name = 'Group name is required.';
  }
  if (!input.track.trim()) {
    errors.track = 'Academic track is required.';
  }
  if (!input.advisor.trim()) {
    errors.advisor = 'Advisor name is required.';
  }
  const cap = Number(input.capacity);
  if (input.capacity.trim() === '' || Number.isNaN(cap) || cap < 5 || cap > 100) {
    errors.capacity = 'Capacity must be between 5 and 100.';
  }
  return errors;
}
