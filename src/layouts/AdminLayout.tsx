import React, { useState } from 'react';
import {
  BarChart3,
  ClipboardCheck,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react';
import type { PageKey, SchoolSettings } from '../types';

interface NavItem {
  key: PageKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'groups', label: 'Groups', icon: GraduationCap },
  { key: 'test-results', label: 'Test Results', icon: ClipboardCheck },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'reports', label: 'Reports', icon: FileSpreadsheet },
  { key: 'settings', label: 'Settings', icon: Settings },
];

interface AdminLayoutProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
  onGlobalSearchSubmit: () => void;
  settings: SchoolSettings;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activePage,
  onNavigate,
  globalSearch,
  onGlobalSearchChange,
  onGlobalSearchSubmit,
  settings,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const currentNav = NAV_ITEMS.find((n) => n.key === activePage) ?? NAV_ITEMS[0];

  const handleNavClick = (page: PageKey) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop & Tablet Sidebar */}
      <aside
        className={`hidden md:flex md:flex-col md:shrink-0 border-r border-slate-200 bg-white transition-[width] duration-200 dark:border-slate-800 dark:bg-slate-900 ${
          sidebarCollapsed ? 'md:w-18' : 'md:w-64'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          {!sidebarCollapsed && (
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className="truncate text-left font-display text-base font-bold tracking-tight text-slate-900 dark:text-slate-100"
            >
              Meridian Edu
            </button>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav aria-label="Primary Navigation" className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activePage;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavClick(item.key)}
                aria-current={isActive ? 'page' : undefined}
                title={sidebarCollapsed ? item.label : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-blue-600 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <div className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
              {settings.schoolInfo.schoolName}
            </div>
            <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
              {settings.schoolInfo.academicYear} · {settings.schoolInfo.termLabel}
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 flex w-72 max-w-[82vw] flex-col bg-white shadow-xl dark:bg-slate-900">
            <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
              <span className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Meridian Edu
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Mobile Navigation" className="flex-1 space-y-1 p-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.key === activePage;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleNavClick(item.key)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {settings.adminProfile.fullName}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {settings.schoolInfo.schoolName}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Horizontal Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 md:h-16 md:px-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 md:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden text-slate-400 sm:inline dark:text-slate-500">
                {settings.schoolInfo.schoolName}
              </span>
              <span className="hidden text-slate-300 sm:inline dark:text-slate-700">
                /
              </span>
              <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
                {currentNav.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onGlobalSearchSubmit();
              }}
              className="relative hidden sm:block"
            >
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                aria-label="Quick search students"
                value={globalSearch}
                onChange={(e) => onGlobalSearchChange(e.target.value)}
                placeholder="Search students or cohorts..."
                className="h-9 w-52 rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus-visible:outline-2 focus-visible:outline-blue-600 lg:w-64 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
              />
            </form>

            <button
              type="button"
              onClick={() => handleNavClick('settings')}
              aria-label="Open admin profile settings"
              className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white py-1 pr-3 pl-1.5 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              {!avatarFailed ? (
                <img
                  src={settings.adminProfile.avatarUrl}
                  alt={settings.adminProfile.fullName}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="h-7 w-7 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-[11px] font-semibold text-white">
                  CM
                </div>
              )}
              <div className="hidden text-left lg:block">
                <div className="max-w-44 truncate text-xs font-medium text-slate-900 dark:text-slate-100">
                  {settings.adminProfile.fullName}
                </div>
                <div className="max-w-44 truncate text-[10px] text-slate-500 dark:text-slate-400">
                  {settings.adminProfile.role}
                </div>
              </div>
            </button>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="mx-auto w-full max-w-[1360px] flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
