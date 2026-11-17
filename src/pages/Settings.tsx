import React, { useState } from 'react';
import type { PageKey, SchoolSettings } from '../types';

interface SettingsProps {
  settings: SchoolSettings;
  onUpdateSettings: (next: SchoolSettings) => void;
  onResetDemoData: () => void;
  onNotify: (message: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetDemoData,
  onNotify,
}) => {
  const [draft, setDraft] = useState<SchoolSettings>(settings);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [avatarFailed, setAvatarFailed] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(draft);
    onNotify('Profile, school, and interface preferences saved.');
  };

  const handleThemeSwitch = (theme: 'light' | 'dark') => {
    const next = {
      ...draft,
      interfacePrefs: { ...draft.interfacePrefs, theme },
    };
    setDraft(next);
    onUpdateSettings(next);
    onNotify(`Switched interface theme to ${theme} mode.`);
  };

  const handleToggleNotification = (
    key: keyof SchoolSettings['notifications']
  ) => {
    const next = {
      ...draft,
      notifications: {
        ...draft.notifications,
        [key]: !draft.notifications[key],
      },
    };
    setDraft(next);
    onUpdateSettings(next);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim() || newPassword.length < 8) {
      setPasswordError(
        'Enter your current password and a new password of at least 8 characters.'
      );
      return;
    }
    setPasswordError('');
    const next = {
      ...draft,
      account: {
        ...draft.account,
        lastPasswordUpdated: '2026-11-16',
      },
    };
    setDraft(next);
    onUpdateSettings(next);
    setCurrentPassword('');
    setNewPassword('');
    onNotify('Account password updated.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Workspace Settings
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Manage administrator profile, school metadata, notifications, interface theme, and account security
        </p>
      </div>

      <form onSubmit={handleSaveGeneral} className="space-y-6">
        {/* Admin Profile & School Information */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Admin Profile */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Admin Profile
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Primary institutional administrator identity
            </p>

            <div className="mt-4 flex items-center gap-4">
              {!avatarFailed ? (
                <img
                  src={draft.adminProfile.avatarUrl}
                  alt={draft.adminProfile.fullName}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="h-14 w-14 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
                  CM
                </div>
              )}
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {draft.adminProfile.fullName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {draft.adminProfile.department}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="admin-name"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Full Name
                </label>
                <input
                  id="admin-name"
                  type="text"
                  value={draft.adminProfile.fullName}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      adminProfile: {
                        ...draft.adminProfile,
                        fullName: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-role"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Title / Role
                </label>
                <input
                  id="admin-role"
                  type="text"
                  value={draft.adminProfile.role}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      adminProfile: {
                        ...draft.adminProfile,
                        role: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={draft.adminProfile.email}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      adminProfile: {
                        ...draft.adminProfile,
                        email: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-phone"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Phone
                </label>
                <input
                  id="admin-phone"
                  type="tel"
                  value={draft.adminProfile.phone}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      adminProfile: {
                        ...draft.adminProfile,
                        phone: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </section>

          {/* School Information */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              School Information
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Institution name, term calendar, and grading scale
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="school-name"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Institution Name
                </label>
                <input
                  id="school-name"
                  type="text"
                  value={draft.schoolInfo.schoolName}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      schoolInfo: {
                        ...draft.schoolInfo,
                        schoolName: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="school-district"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  District
                </label>
                <input
                  id="school-district"
                  type="text"
                  value={draft.schoolInfo.district}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      schoolInfo: {
                        ...draft.schoolInfo,
                        district: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="school-year"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Academic Year
                </label>
                <input
                  id="school-year"
                  type="text"
                  value={draft.schoolInfo.academicYear}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      schoolInfo: {
                        ...draft.schoolInfo,
                        academicYear: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="school-term"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Active Term
                </label>
                <input
                  id="school-term"
                  type="text"
                  value={draft.schoolInfo.termLabel}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      schoolInfo: {
                        ...draft.schoolInfo,
                        termLabel: e.target.value,
                      },
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="grading-scale"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Grading Scale
                </label>
                <select
                  id="grading-scale"
                  value={draft.schoolInfo.gradingScale}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      schoolInfo: {
                        ...draft.schoolInfo,
                        gradingScale: e.target.value as SchoolSettings['schoolInfo']['gradingScale'],
                      },
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="4.0 Scale">4.0 Scale</option>
                  <option value="100-Point Scale">100-Point Scale</option>
                  <option value="IB 1-7 Scale">IB 1-7 Scale</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Notifications & Interface Preferences */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Notification Preferences
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Control automated advisor alerts and reporting digests
            </p>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {(
                [
                  {
                    key: 'weeklyDigest',
                    title: 'Weekly Performance Digest',
                    desc: 'Monday summary of cohort completion and readiness shifts',
                  },
                  {
                    key: 'overdueTestAlerts',
                    title: 'Overdue Assessment Alerts',
                    desc: 'Notify advisors when student diagnostics pass deadline',
                  },
                  {
                    key: 'cohortMilestones',
                    title: 'Cohort Completion Milestones',
                    desc: 'Confirm when a cohort reaches 90% assessment completion',
                  },
                  {
                    key: 'careerMismatchFlags',
                    title: 'Career Alignment Flags',
                    desc: 'Flag students whose aptitude results diverge from selected track',
                  },
                ] as const
              ).map((item) => {
                const enabled = draft.notifications[item.key];
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 py-3 first:pt-1 last:pb-1"
                  >
                    <div>
                      <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={enabled}
                      aria-label={item.title}
                      onClick={() => handleToggleNotification(item.key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                        enabled
                          ? 'bg-blue-600'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Interface Preferences */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Interface Preferences
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Appearance, table row spacing, and default workspace route
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Color Theme
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleThemeSwitch('light')}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                      draft.interfacePrefs.theme === 'light'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Light Surface
                  </button>
                  <button
                    type="button"
                    onClick={() => handleThemeSwitch('dark')}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                      draft.interfacePrefs.theme === 'dark'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Dark Slate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="table-density"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Table Row Density
                  </label>
                  <select
                    id="table-density"
                    value={draft.interfacePrefs.tableDensity}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        interfacePrefs: {
                          ...draft.interfacePrefs,
                          tableDensity: e.target.value as 'comfortable' | 'compact',
                        },
                      })
                    }
                    className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="comfortable">Comfortable</option>
                    <option value="compact">Compact</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="default-landing"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Default Landing Page
                  </label>
                  <select
                    id="default-landing"
                    value={draft.interfacePrefs.defaultLandingPage}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        interfacePrefs: {
                          ...draft.interfacePrefs,
                          defaultLandingPage: e.target.value as PageKey,
                        },
                      })
                    }
                    className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="students">Students</option>
                    <option value="groups">Groups</option>
                    <option value="test-results">Test Results</option>
                    <option value="analytics">Analytics</option>
                    <option value="reports">Reports</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-5 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Account Settings */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Account Security & Workspace Data
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Password last updated {draft.account.lastPasswordUpdated} · Two-factor authentication{' '}
              {draft.account.twoFactorEnabled ? 'enabled' : 'disabled'}
            </p>
          </div>

          <button
            type="button"
            onClick={onResetDemoData}
            className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Restore Default Dataset
          </button>
        </div>

        <form
          onSubmit={handlePasswordUpdate}
          className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3 dark:border-slate-800"
        >
          <div>
            <label
              htmlFor="current-pw"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Current Password
            </label>
            <input
              id="current-pw"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setPasswordError('');
              }}
              placeholder="••••••••"
              className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="new-pw"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              New Password (min 8 chars)
            </label>
            <input
              id="new-pw"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError('');
              }}
              placeholder="Minimum 8 characters"
              className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-900 px-4 text-xs font-medium text-white hover:bg-slate-800 sm:w-auto dark:border-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Update Password
            </button>
          </div>
        </form>
        {passwordError && (
          <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
            {passwordError}
          </p>
        )}
      </section>
    </div>
  );
};
