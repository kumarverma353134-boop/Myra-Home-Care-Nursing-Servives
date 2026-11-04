import React from 'react';
import { UserRole } from '../../types';
import { Shield, User, Briefcase, Activity, Globe, Download, Phone, Sun, Moon } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole | 'website' | 'login';
  onSelectRole: (role: UserRole | 'website') => void;
  onOpenZipModal: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onSelectRole,
  onOpenZipModal,
  isDarkMode,
  onToggleDarkMode
}) => {
  return (
    <aside aria-label="Development & testing role switcher" className="bg-slate-900 text-slate-100 text-xs px-3 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-teal-400 tracking-wide uppercase flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 animate-pulse text-teal-400" />
          MYRA Workspace
        </span>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <span className="text-slate-300 hidden sm:inline">
          Active Role: <strong className="text-white capitalize">{currentRole}</strong>
        </span>
      </div>

      <nav aria-label="Role preview navigation" className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onSelectRole('website')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
            currentRole === 'website'
              ? 'bg-teal-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Public Website (Home, Services, Contact)"
        >
          <Globe className="w-3 h-3" />
          Website
        </button>

        <button
          onClick={() => onSelectRole('customer')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
            currentRole === 'customer'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Customer Dashboard (Bookings, Patient Profiles, Quotations, Payments)"
        >
          <User className="w-3 h-3" />
          Customer
        </button>

        <button
          onClick={() => onSelectRole('manager')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
            currentRole === 'manager'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Manager Dashboard (Daily operations, staff assignments, quotations, verify payments)"
        >
          <Briefcase className="w-3 h-3" />
          Manager
        </button>

        <button
          onClick={() => onSelectRole('staff')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
            currentRole === 'staff'
              ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Staff Dashboard (Futuristic Dark UI, duty schedule, attendance, duty actions)"
        >
          <Activity className="w-3 h-3" />
          Staff (Dark UI)
        </button>

        <button
          onClick={() => onSelectRole('owner')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
            currentRole === 'owner'
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Owner Master Control Center (33 sections, staff verification, UPI ID setup, maintenance)"
        >
          <Shield className="w-3 h-3" />
          Owner
        </button>
      </nav>

      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/918893659849"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
          title="Official Helpline & Document sharing on WhatsApp"
        >
          <Phone className="w-3 h-3" />
          <span>88936 59849</span>
        </a>

        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-bold"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-300" />}
            <span className="hidden md:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
        )}

        {currentRole === 'owner' && (
          <button
            onClick={onOpenZipModal}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-2 py-1 rounded text-[11px] flex items-center gap-1 transition-colors"
            title="Download complete project ZIP for GitHub Pages"
          >
            <Download className="w-3 h-3" />
            <span>Export ZIP</span>
          </button>
        )}
      </div>
    </aside>
  );
};
