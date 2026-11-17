export type PageKey =
  | 'dashboard'
  | 'students'
  | 'groups'
  | 'test-results'
  | 'analytics'
  | 'reports'
  | 'settings';

export type StudentStatus = 'Active' | 'Needs Review' | 'Inactive';

export type TestStatus = 'Completed' | 'In Progress' | 'Overdue';

export type CareerDirection =
  | 'Engineering & Tech'
  | 'Healthcare & Bio'
  | 'Business & Finance'
  | 'Arts & Media'
  | 'Social Sciences'
  | 'Undecided';

export type ReportType =
  | 'overview'
  | 'students'
  | 'test-completion'
  | 'career-direction';

export type DateRangePreset = '30d' | '90d' | 'ytd' | 'custom';

export interface Student {
  id: string;
  studentCode: string;
  name: string;
  email: string;
  grade: string;
  groupId: string;
  groupName: string;
  status: StudentStatus;
  gpa: number;
  attendanceRate: number;
  testsCompleted: number;
  testsAssigned: number;
  readinessScore: number;
  careerDirection: CareerDirection;
  advisor: string;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface Group {
  id: string;
  name: string;
  gradeLevel: string;
  track: string;
  advisor: string;
  room: string;
  capacity: number;
  avgReadiness: number;
  completionRate: number;
  createdAt: string;
}

export interface SectionScore {
  label: string;
  score: number;
  maxScore: number;
}

export interface TestResult {
  id: string;
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  testTitle: string;
  category: 'Career Aptitude' | 'STEM Diagnostic' | 'Academic Benchmark' | 'Leadership Eval';
  score: number;
  maxScore: number;
  status: TestStatus;
  submittedDate: string; // YYYY-MM-DD
  durationMinutes: number;
  recommendedTrack: CareerDirection;
  sections: SectionScore[];
  notes: string;
}

export interface MonthlyTrendPoint {
  month: string;
  completions: number;
  avgScore: number;
  targetCompletions: number;
}

export interface SchoolSettings {
  adminProfile: {
    fullName: string;
    role: string;
    email: string;
    phone: string;
    department: string;
    avatarUrl: string;
  };
  schoolInfo: {
    schoolName: string;
    district: string;
    academicYear: string;
    termLabel: string;
    gradingScale: '4.0 Scale' | '100-Point Scale' | 'IB 1-7 Scale';
    counselorCount: number;
  };
  notifications: {
    weeklyDigest: boolean;
    overdueTestAlerts: boolean;
    cohortMilestones: boolean;
    careerMismatchFlags: boolean;
  };
  interfacePrefs: {
    theme: 'light' | 'dark';
    tableDensity: 'comfortable' | 'compact';
    defaultLandingPage: PageKey;
    showComparisonDeltas: boolean;
  };
  account: {
    sessionTimeoutMinutes: number;
    twoFactorEnabled: boolean;
    lastPasswordUpdated: string;
  };
}

export interface DashboardKPIs {
  totalStudents: number;
  activeStudentsDelta: string;
  activeGroups: number;
  groupsSubtext: string;
  assessmentsCompleted: number;
  assessmentsDelta: string;
  avgReadinessScore: number;
  readinessDelta: string;
  careerMatchedCount: number;
  careerMatchedRate: number;
}

export interface StudentFilters {
  search: string;
  groupId: string;
  status: 'All' | StudentStatus;
  careerDirection: 'All' | CareerDirection;
}

export interface TestResultFilters {
  search: string;
  category: 'All' | TestResult['category'];
  status: 'All' | TestStatus;
  groupId: string;
}

export interface ReportConfig {
  reportType: ReportType;
  startDate: string;
  endDate: string;
  groupId: string;
}
