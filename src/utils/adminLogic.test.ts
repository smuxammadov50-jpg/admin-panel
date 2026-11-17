import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_GROUPS,
  INITIAL_STUDENTS,
  INITIAL_TEST_RESULTS,
} from '../data/mockData';
import {
  buildReportData,
  computeCareerBreakdown,
  computeDashboardMetrics,
  filterStudents,
  filterTestResults,
  generateCsvContent,
  paginateItems,
  sortStudents,
  validateGroupForm,
  validateStudentForm,
} from './adminLogic';

test('computeDashboardMetrics calculates 5 KPI metrics accurately for all groups', () => {
  const kpis = computeDashboardMetrics(
    INITIAL_STUDENTS,
    INITIAL_GROUPS,
    INITIAL_TEST_RESULTS,
    'all',
    'semester'
  );

  assert.equal(kpis.totalStudents, INITIAL_STUDENTS.length);
  assert.equal(kpis.activeGroups, INITIAL_GROUPS.length);
  assert.ok(kpis.avgReadinessScore > 75 && kpis.avgReadinessScore < 95);
  assert.ok(kpis.careerMatchedCount < kpis.totalStudents);
  assert.ok(kpis.careerMatchedRate > 80);
});

test('computeDashboardMetrics scopes KPIs when filtering by a single group', () => {
  const kpis = computeDashboardMetrics(
    INITIAL_STUDENTS,
    INITIAL_GROUPS,
    INITIAL_TEST_RESULTS,
    'grp-12e',
    'semester'
  );

  assert.equal(kpis.activeGroups, 1);
  assert.equal(kpis.totalStudents, 4);
  assert.equal(kpis.careerMatchedRate, 100);
});

test('filterStudents and sortStudents combine search, status, and GPA sorting', () => {
  const filtered = filterStudents(INITIAL_STUDENTS, {
    search: 'maya',
    groupId: 'all',
    status: 'All',
    careerDirection: 'All',
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].name, 'Maya Lin');

  const needsReview = filterStudents(INITIAL_STUDENTS, {
    search: '',
    groupId: 'all',
    status: 'Needs Review',
    careerDirection: 'All',
  });
  assert.equal(needsReview.length, 3);

  const sorted = sortStudents(INITIAL_STUDENTS, 'gpa', 'desc');
  assert.ok(sorted[0].gpa >= sorted[1].gpa);
});

test('paginateItems clamps out-of-range pages and computes indices', () => {
  const page1 = paginateItems(INITIAL_STUDENTS, 1, 8);
  assert.equal(page1.items.length, 8);
  assert.equal(page1.totalPages, 3);
  assert.equal(page1.startIndex, 1);
  assert.equal(page1.endIndex, 8);

  const page99 = paginateItems(INITIAL_STUDENTS, 99, 8);
  assert.equal(page99.currentPage, 3);
  assert.equal(page99.items.length, 8);
});

test('filterTestResults filters by status and category', () => {
  const overdue = filterTestResults(INITIAL_TEST_RESULTS, {
    search: '',
    category: 'All',
    status: 'Overdue',
    groupId: 'all',
  });
  assert.equal(overdue.length, 2);
});

test('buildReportData respects date range filters and generates career breakdown', () => {
  const testReport = buildReportData(
    INITIAL_STUDENTS,
    INITIAL_GROUPS,
    INITIAL_TEST_RESULTS,
    {
      reportType: 'test-completion',
      startDate: '2026-11-10',
      endDate: '2026-11-16',
      groupId: 'all',
    }
  );
  assert.equal(testReport.title, 'Test Completion Report');
  assert.ok(testReport.rows.length > 0);
  assert.ok(testReport.rows.every((row) => row[5] >= '2026-11-10'));

  const careerBreakdown = computeCareerBreakdown(INITIAL_STUDENTS, 'all');
  const sum = careerBreakdown.reduce((acc, item) => acc + item.count, 0);
  assert.equal(sum, INITIAL_STUDENTS.length);
});

test('generateCsvContent properly escapes commas and quotes', () => {
  const csv = generateCsvContent(
    ['Student', 'Notes'],
    [['O’Connor, Liam', 'Said "great work"']]
  );
  assert.equal(csv, 'Student,Notes\r\n"O’Connor, Liam","Said ""great work"""');
});

test('validateStudentForm and validateGroupForm reject invalid inputs', () => {
  const studentErrors = validateStudentForm({
    name: '',
    email: 'not-an-email',
    groupId: '',
    gpa: '4.5',
    careerDirection: 'Engineering & Tech',
  });
  assert.ok(studentErrors.name);
  assert.ok(studentErrors.email);
  assert.ok(studentErrors.groupId);
  assert.ok(studentErrors.gpa);

  const groupErrors = validateGroupForm({
    name: '',
    gradeLevel: 'Grade 10',
    track: '',
    advisor: '',
    room: '',
    capacity: '2',
  });
  assert.ok(groupErrors.name);
  assert.ok(groupErrors.track);
  assert.ok(groupErrors.advisor);
  assert.ok(groupErrors.capacity);
});
