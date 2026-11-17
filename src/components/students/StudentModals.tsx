import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { CAREER_DIRECTIONS, validateStudentForm } from '../../utils/adminLogic';
import type {
  CareerDirection,
  Group,
  Student,
  StudentStatus,
  TestResult,
} from '../../types';

interface AddStudentModalProps {
  open: boolean;
  groups: Group[];
  onClose: () => void;
  onAddStudent: (input: {
    name: string;
    email: string;
    groupId: string;
    gpa: number;
    careerDirection: CareerDirection;
  }) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  open,
  groups,
  onClose,
  onAddStudent,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [groupId, setGroupId] = useState(groups[0]?.id ?? '');
  const [gpa, setGpa] = useState('3.50');
  const [careerDirection, setCareerDirection] =
    useState<CareerDirection>('Engineering & Tech');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setName('');
      setEmail('');
      setGroupId(groups[0]?.id ?? '');
      setGpa('3.50');
      setCareerDirection('Engineering & Tech');
      setErrors({});
    }
  }, [open, groups]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateStudentForm({
      name,
      email,
      groupId,
      gpa,
      careerDirection,
    });
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    onAddStudent({
      name: name.trim(),
      email: email.trim(),
      groupId,
      gpa: Number(Number(gpa).toFixed(2)),
      careerDirection,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Enroll New Student"
      subtitle="Assign student to an academic cohort and career guidance track."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="student-name"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Full Name
          </label>
          <input
            id="student-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="e.g., Jordan Vance"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="student-email"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Academic Email
          </label>
          <input
            id="student-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            placeholder="jordan.vance@lincolnprep.edu"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
              {errors.email}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="student-group"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Assigned Group
            </label>
            <select
              id="student-group"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            {errors.groupId && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                {errors.groupId}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="student-gpa"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Current GPA (0.00–4.00)
            </label>
            <input
              id="student-gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={gpa}
              onChange={(e) => {
                setGpa(e.target.value);
                if (errors.gpa) setErrors((prev) => ({ ...prev, gpa: '' }));
              }}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 tabular-nums focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.gpa && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                {errors.gpa}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="student-career"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Career Direction
          </label>
          <select
            id="student-career"
            value={careerDirection}
            onChange={(e) =>
              setCareerDirection(e.target.value as CareerDirection)
            }
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {CAREER_DIRECTIONS.map((dir) => (
              <option key={dir} value={dir}>
                {dir}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            Save Student
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface StudentDetailModalProps {
  student: Student | null;
  testResults: TestResult[];
  onClose: () => void;
  onUpdateStatus: (studentId: string, status: StudentStatus) => void;
  onUpdateCareer: (studentId: string, careerDirection: CareerDirection) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  testResults,
  onClose,
  onUpdateStatus,
  onUpdateCareer,
}) => {
  if (!student) return null;

  const studentTests = testResults.filter((r) => r.studentId === student.id);

  return (
    <Modal
      open={Boolean(student)}
      onClose={onClose}
      title={student.name}
      subtitle={`${student.studentCode} · ${student.email} · ${student.groupName}`}
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              GPA
            </div>
            <div className="mt-1 font-mono text-lg font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {student.gpa.toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Readiness
            </div>
            <div className="mt-1 font-mono text-lg font-semibold text-blue-600 tabular-nums dark:text-blue-400">
              {student.readinessScore}%
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Attendance
            </div>
            <div className="mt-1 font-mono text-lg font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {student.attendanceRate}%
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Assessments
            </div>
            <div className="mt-1 font-mono text-lg font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {student.testsCompleted}/{student.testsAssigned}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2 dark:border-slate-800">
          <div>
            <label
              htmlFor="detail-status"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Standing Status
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <select
                id="detail-status"
                value={student.status}
                onChange={(e) =>
                  onUpdateStatus(student.id, e.target.value as StudentStatus)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Active">Active</option>
                <option value="Needs Review">Needs Review</option>
                <option value="Inactive">Inactive</option>
              </select>
              <StatusBadge status={student.status} />
            </div>
          </div>

          <div>
            <label
              htmlFor="detail-career"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Career Pathway
            </label>
            <select
              id="detail-career"
              value={student.careerDirection}
              onChange={(e) =>
                onUpdateCareer(student.id, e.target.value as CareerDirection)
              }
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {CAREER_DIRECTIONS.map((dir) => (
                <option key={dir} value={dir}>
                  {dir}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Recent Assessment History
          </h3>
          {studentTests.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              No individual assessments logged yet for this student.
            </p>
          ) : (
            <div className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {studentTests.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 text-xs"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-900 dark:text-slate-100">
                      {t.testTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t.category} · {t.submittedDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                      {t.score}/{t.maxScore}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
