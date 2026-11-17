import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { validateGroupForm } from '../../utils/adminLogic';
import type { Group, Student } from '../../types';

interface AddGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreateGroup: (input: {
    name: string;
    gradeLevel: string;
    track: string;
    advisor: string;
    room: string;
    capacity: number;
  }) => void;
}

export const AddGroupModal: React.FC<AddGroupModalProps> = ({
  open,
  onClose,
  onCreateGroup,
}) => {
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Grade 11');
  const [track, setTrack] = useState('');
  const [advisor, setAdvisor] = useState('');
  const [room, setRoom] = useState('');
  const [capacity, setCapacity] = useState('28');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setName('');
      setGradeLevel('Grade 11');
      setTrack('');
      setAdvisor('');
      setRoom('East Wing 210');
      setCapacity('28');
      setErrors({});
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateGroupForm({
      name,
      gradeLevel,
      track,
      advisor,
      room,
      capacity,
    });
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    onCreateGroup({
      name: name.trim(),
      gradeLevel,
      track: track.trim(),
      advisor: advisor.trim(),
      room: room.trim() || 'Main Hall 101',
      capacity: Number(capacity),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Student Cohort"
      subtitle="Configure a new academic group, advisor assignment, and seat capacity."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="group-name"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Group Name
          </label>
          <input
            id="group-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="e.g., Grade 11 — Biomedical Seminar"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="group-grade"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Grade Level
            </label>
            <select
              id="group-grade"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="group-capacity"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Seat Capacity
            </label>
            <input
              id="group-capacity"
              type="number"
              min="5"
              max="100"
              value={capacity}
              onChange={(e) => {
                setCapacity(e.target.value);
                if (errors.capacity)
                  setErrors((prev) => ({ ...prev, capacity: '' }));
              }}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 tabular-nums focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.capacity && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                {errors.capacity}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="group-track"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Focus Track
          </label>
          <input
            id="group-track"
            type="text"
            value={track}
            onChange={(e) => {
              setTrack(e.target.value);
              if (errors.track) setErrors((prev) => ({ ...prev, track: '' }));
            }}
            placeholder="e.g., Life Sciences & Pre-Med"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {errors.track && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
              {errors.track}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="group-advisor"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Lead Advisor
            </label>
            <input
              id="group-advisor"
              type="text"
              value={advisor}
              onChange={(e) => {
                setAdvisor(e.target.value);
                if (errors.advisor)
                  setErrors((prev) => ({ ...prev, advisor: '' }));
              }}
              placeholder="e.g., Dr. Hannah Cho"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.advisor && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                {errors.advisor}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="group-room"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Room / Wing
            </label>
            <input
              id="group-room"
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g., Science Hall 204"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
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
            Create Group
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface GroupRosterModalProps {
  group: Group | null;
  students: Student[];
  onClose: () => void;
  onInspectStudent: (student: Student) => void;
}

export const GroupRosterModal: React.FC<GroupRosterModalProps> = ({
  group,
  students,
  onClose,
  onInspectStudent,
}) => {
  if (!group) return null;

  const roster = students.filter((s) => s.groupId === group.id);

  return (
    <Modal
      open={Boolean(group)}
      onClose={onClose}
      title={group.name}
      subtitle={`${group.advisor} · ${group.room} · ${group.track}`}
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Enrolled
            </div>
            <div className="mt-1 font-mono text-base font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {roster.length} / {group.capacity}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Avg Readiness
            </div>
            <div className="mt-1 font-mono text-base font-semibold text-blue-600 tabular-nums dark:text-blue-400">
              {group.avgReadiness}%
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Completion
            </div>
            <div className="mt-1 font-mono text-base font-semibold text-emerald-700 tabular-nums dark:text-emerald-400">
              {group.completionRate}%
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Assigned Students ({roster.length})
          </h3>
          {roster.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              No students currently enrolled in this group.
            </p>
          ) : (
            <div className="mt-2 max-h-64 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {roster.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onInspectStudent(s);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-900 dark:text-slate-100">
                      {s.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {s.studentCode} · {s.careerDirection}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-medium text-slate-700 tabular-nums dark:text-slate-300">
                      {s.readinessScore}%
                    </span>
                    <StatusBadge status={s.status} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
