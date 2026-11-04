import React from 'react';
import { HeartPulse, Phone, MessageCircle, Shield } from 'lucide-react';
import { SystemSettings } from '../../types';

interface MaintenanceViewProps {
  settings: SystemSettings;
  onOpenOwner: () => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ settings, onOpenOwner }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-12 relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
            <HeartPulse className="w-6 h-6 text-slate-950" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            MYRA <span className="text-teal-400">HomeCare</span>
          </span>
        </div>

        {/* Owner Bypass Link */}
        <button
          onClick={onOpenOwner}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-amber-500/10 transition-colors"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Owner Administration Login</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-xl mx-auto w-full text-center py-16 space-y-6">
        <div className="inline-block px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
          Scheduled System Upgrade
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          System Maintenance in Progress
        </h1>

        <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-left space-y-3">
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {settings.maintenanceMessageHi}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {settings.maintenanceMessageEn}
          </p>
          <div className="pt-2 text-xs text-teal-400 flex items-center justify-between border-t border-slate-700">
            <span>Expected Reopening:</span>
            <span className="font-bold">{settings.expectedReopenTime}</span>
          </div>
        </div>

        {/* Emergency Helpline Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`tel:${settings.phone}`}
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call Nursing Control: {settings.phone}</span>
          </a>
          <a
            href={`https://wa.me/91${settings.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Operations</span>
          </a>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500">
        MYRA Home Care Nursing Services · Patna, Bihar, India
      </div>
    </div>
  );
};
