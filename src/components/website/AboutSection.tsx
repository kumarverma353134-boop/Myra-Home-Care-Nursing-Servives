import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { SystemSettings } from '../../types';

interface AboutSectionProps {
  settings: SystemSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const cleanSecPhone = (settings.secondaryPhone || '8893659849').replace(/[^0-9]/g, '');

  return (
    <section id="team" className="py-12 sm:py-16 bg-[#071228] transition-colors border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#06153d] via-[#092659] to-[#0c3975] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-cyan-900/50 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left info column */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-emerald-400 font-extrabold text-xs uppercase tracking-widest block">
              {settings.infoTitle || 'Care with responsibility'}
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Support for Patients & Families
            </h2>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {settings.infoDesc || "Share the patient's care requirement, location and preferred timing with our manager. The team will confirm the suitable service, quotation and staff availability before booking."}
            </p>

            {/* Pills matching user's template */}
            <div className="flex flex-wrap gap-2 pt-2">
              {(settings.teamPills || ['Male Staff', 'Female Staff', 'Nursing Support', 'Patient Attendants', 'Home Sample Collection', 'Medicine Delivery']).map((pill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/60 text-xs font-bold text-cyan-200 shadow-xs"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Right contactbox matching user's template */}
          <div className="lg:col-span-5">
            <div className="bg-[#0c1a36] text-white p-6 rounded-2xl shadow-xl border border-cyan-500/30 space-y-3">
              <h3 className="font-extrabold text-base text-white flex items-center justify-between">
                <span>Speak with MYRA</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">24/7 Helpline</span>
              </h3>

              <div className="space-y-1">
                <a
                  href={`tel:+91${cleanPhone}`}
                  className="block text-xl sm:text-2xl font-black text-cyan-300 hover:text-cyan-200 hover:underline"
                >
                  +91 {settings.phone}
                </a>

                {settings.secondaryPhone && (
                  <a
                    href={`tel:+91${cleanSecPhone}`}
                    className="block text-xl sm:text-2xl font-black text-emerald-300 hover:text-emerald-200 hover:underline"
                  >
                    +91 {settings.secondaryPhone}
                  </a>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Call to confirm the service area, timing, price and staff availability. Room / Home care ke liye संपर्क करें।
              </p>

              <a
                href={`https://wa.me/91${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 mt-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
