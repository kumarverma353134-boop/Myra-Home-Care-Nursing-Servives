import React from 'react';
import { Phone, MessageCircle, Calendar, ShieldCheck, Heart, UserCheck } from 'lucide-react';
import { SystemSettings } from '../../types';

interface HeroProps {
  settings: SystemSettings;
  onOpenBooking: () => void;
  onOpenServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onOpenBooking, onOpenServices }) => {
  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');

  return (
    <section id="hero" className="py-6 sm:py-10 bg-[#071228] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Quick Action Bar under the banner */}
        <div className="bg-[#0c1a36] rounded-2xl p-4 sm:p-6 border border-cyan-900/40 shadow-xl mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-widest block">
              {settings.heroTitle || 'Better Care ❤️ Better Life'}
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              {settings.heroSubtitle || 'आपके भरोसेमंद साथी — घर पर ही बेहतर ईलाज। Call or WhatsApp our Patna duty team directly.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:+91${cleanPhone}`}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-transform active:scale-95 border border-emerald-400/30"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>Call +91 {settings.phone}</span>
            </a>

            <a
              href={`https://wa.me/91${cleanPhone}?text=Namaste%20MYRA%20HomeCare%2C%20I%20need%20nursing%20care%20services%20in%20Patna.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 border border-blue-400/30"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp Us</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="px-5 py-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-400/30 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <Calendar className="w-4 h-4 text-cyan-300" />
              <span>Request Online</span>
            </button>
          </div>
        </div>

        {/* 3 Stats Strip matching poster & user's template */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1a36] border border-cyan-900/40 shadow-lg text-center transition-all hover:border-cyan-500/40">
            <b className="block text-white font-extrabold text-base sm:text-lg">
              {settings.stat1Title || 'Male & Female Staff'}
            </b>
            <span className="text-xs text-cyan-300 font-medium">
              {settings.stat1Desc || 'Available · मेल एवं फीमेल स्टाफ उपलब्ध'}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1a36] border border-emerald-900/40 shadow-lg text-center transition-all hover:border-emerald-500/40">
            <b className="block text-white font-extrabold text-base sm:text-lg">
              {settings.stat2Title || '24/7 Service Support'}
            </b>
            <span className="text-xs text-emerald-300 font-medium">
              {settings.stat2Desc || 'Because Your Health Matters ❤️'}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1a36] border border-blue-900/40 shadow-lg text-center transition-all hover:border-blue-500/40">
            <b className="block text-white font-extrabold text-base sm:text-lg">
              {settings.stat3Title || 'Patna, Bihar'}
            </b>
            <span className="text-xs text-blue-300 font-medium">
              {settings.stat3Desc || 'Room / Home care ke liye संपर्क करें'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
