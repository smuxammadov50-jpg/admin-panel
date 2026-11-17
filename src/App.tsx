import { useEffect, useState } from 'react';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Groups } from './pages/Groups';
import { TestResults } from './pages/TestResults';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import {
  AddStudentModal,
  StudentDetailModal,
} from './components/students/StudentModals';
import {
  AddGroupModal,
  GroupRosterModal,
} from './components/groups/GroupModals';
import { ResultDetailModal } from './components/results/ResultDetailModal';
import { Toast } from './components/common/Toast';
import {
  DEFAULT_SETTINGS,
  INITIAL_GROUPS,
  INITIAL_STUDENTS,
  INITIAL_TEST_RESULTS,
} from './data/mockData';
import type {
  CareerDirection,
  Group,
  PageKey,
  SchoolSettings,
  Student,
  StudentStatus,
  TestResult,
  TestStatus,
} from './types';

const STORAGE_KEY_SETTINGS = 'meridian_edu_settings_v1';
const STORAGE_KEY_STUDENTS = 'meridian_edu_students_v1';
const STORAGE_KEY_GROUPS = 'meridian_edu_groups_v1';
const STORAGE_KEY_RESULTS = 'meridian_edu_results_v1';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [settings, setSettings] = useState<SchoolSettings>(() =>
    loadStored(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS)
  );
  const [students, setStudents] = useState<Student[]>(() =>
    loadStored(STORAGE_KEY_STUDENTS, INITIAL_STUDENTS)
  );
  const [groups, setGroups] = useState<Group[]>(() =>
    loadStored(STORAGE_KEY_GROUPS, INITIAL_GROUPS)
  );
  const [testResults, setTestResults] = useState<TestResult[]>(() =>
    loadStored(STORAGE_KEY_RESULTS, INITIAL_TEST_RESULTS)
  );

  const [activePage, setActivePage] = useState<PageKey>(
    () => settings.interfacePrefs.defaultLandingPage || 'dashboard'
  );
  const [globalSearch, setGlobalSearch] = useState('');
  const [studentInitialCareer, setStudentInitialCareer] = useState<
    'All' | CareerDirection
  >('All');

  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme class with documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (settings.interfacePrefs.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.interfacePrefs.theme]);

  // Persist changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      window.localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
      window.localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      window.localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(testResults));
    } catch {
      // Ignore storage quota errors
    }
  }, [settings, students, groups, testResults]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) ?? null;
  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;
  const selectedResult =
    testResults.find((r) => r.id === selectedResultId) ?? null;

  const handleAddStudent = (input: {
    name: string;
    email: string;
    groupId: string;
    gpa: number;
    careerDirection: CareerDirection;
  }) => {
    const group = groups.find((g) => g.id === input.groupId) ?? groups[0];
    const nextNum = 2601 + students.length;
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      studentCode: `STU-${nextNum}`,
      name: input.name,
      email: input.email,
      grade: group.gradeLevel,
      groupId: group.id,
      groupName: group.name,
      status: 'Active',
      gpa: input.gpa,
      attendanceRate: 96,
      testsCompleted: 1,
      testsAssigned: 5,
      readinessScore: Math.min(98, Math.round(input.gpa * 23)),
      careerDirection: input.careerDirection,
      advisor: group.advisor,
      lastActiveDate: '2026-11-16',
    };
    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Enrolled ${newStudent.name} in ${group.name}.`);
  };

  const handleUpdateStudentStatus = (
    studentId: string,
    status: StudentStatus
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
    showToast(`Updated student standing to ${status}.`);
  };

  const handleUpdateStudentCareer = (
    studentId: string,
    careerDirection: CareerDirection
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, careerDirection } : s))
    );
    showToast(`Updated career pathway to ${careerDirection}.`);
  };

  const handleCreateGroup = (input: {
    name: string;
    gradeLevel: string;
    track: string;
    advisor: string;
    room: string;
    capacity: number;
  }) => {
    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      name: input.name,
      gradeLevel: input.gradeLevel,
      track: input.track,
      advisor: input.advisor,
      room: input.room,
      capacity: input.capacity,
      avgReadiness: 80,
      completionRate: 85,
      createdAt: '2026-11-16',
    };
    setGroups((prev) => [newGroup, ...prev]);
    showToast(`Created cohort "${newGroup.name}".`);
  };

  const handleUpdateResultStatus = (resultId: string, status: TestStatus) => {
    setTestResults((prev) =>
      prev.map((r) => (r.id === resultId ? { ...r, status } : r))
    );
    showToast(`Assessment marked as ${status}.`);
  };

  const handleResetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setGroups(INITIAL_GROUPS);
    setTestResults(INITIAL_TEST_RESULTS);
    setSettings(DEFAULT_SETTINGS);
    showToast('Restored default institutional dataset.');
  };

  return (
    <>
      <AdminLayout
        activePage={activePage}
        onNavigate={(page) => {
          if (page !== 'students') {
            setStudentInitialCareer('All');
          }
          setActivePage(page);
        }}
        globalSearch={globalSearch}
        onGlobalSearchChange={setGlobalSearch}
        onGlobalSearchSubmit={() => {
          setActivePage('students');
        }}
        settings={settings}
      >
        {activePage === 'dashboard' && (
          <Dashboard
            students={students}
            groups={groups}
            testResults={testResults}
            onNavigate={setActivePage}
            onInspectResult={(res) => setSelectedResultId(res.id)}
            onSelectCareerFilter={(dir) => setStudentInitialCareer(dir)}
          />
        )}

        {activePage === 'students' && (
          <Students
            key={`${globalSearch}-${studentInitialCareer}`}
            students={students}
            groups={groups}
            initialSearch={globalSearch}
            initialCareerFilter={studentInitialCareer}
            tableDensity={settings.interfacePrefs.tableDensity}
            onOpenAddStudent={() => setAddStudentOpen(true)}
            onSelectStudent={(stu) => setSelectedStudentId(stu.id)}
          />
        )}

        {activePage === 'groups' && (
          <Groups
            groups={groups}
            students={students}
            onOpenCreateGroup={() => setAddGroupOpen(true)}
            onSelectGroup={(grp) => setSelectedGroupId(grp.id)}
          />
        )}

        {activePage === 'test-results' && (
          <TestResults
            results={testResults}
            groups={groups}
            tableDensity={settings.interfacePrefs.tableDensity}
            onSelectResult={(res) => setSelectedResultId(res.id)}
          />
        )}

        {activePage === 'analytics' && (
          <Analytics
            students={students}
            groups={groups}
            testResults={testResults}
            onNavigateToReports={() => setActivePage('reports')}
          />
        )}

        {activePage === 'reports' && (
          <Reports
            students={students}
            groups={groups}
            testResults={testResults}
            schoolName={settings.schoolInfo.schoolName}
            onNotify={showToast}
          />
        )}

        {activePage === 'settings' && (
          <Settings
            settings={settings}
            onUpdateSettings={setSettings}
            onResetDemoData={handleResetDemoData}
            onNotify={showToast}
          />
        )}
      </AdminLayout>

      <AddStudentModal
        open={addStudentOpen}
        groups={groups}
        onClose={() => setAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
      />

      <StudentDetailModal
        student={selectedStudent}
        testResults={testResults}
        onClose={() => setSelectedStudentId(null)}
        onUpdateStatus={handleUpdateStudentStatus}
        onUpdateCareer={handleUpdateStudentCareer}
      />

      <AddGroupModal
        open={addGroupOpen}
        onClose={() => setAddGroupOpen(false)}
        onCreateGroup={handleCreateGroup}
      />

      <GroupRosterModal
        group={selectedGroup}
        students={students}
        onClose={() => setSelectedGroupId(null)}
        onInspectStudent={(stu) => setSelectedStudentId(stu.id)}
      />

      <ResultDetailModal
        result={selectedResult}
        onClose={() => setSelectedResultId(null)}
        onUpdateStatus={handleUpdateResultStatus}
      />

      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </>
  );
}
