import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { UserRole, SystemSettings } from '../../types';

interface FooterProps {
  settings: SystemSettings;
  onOpenLegal: (pageKey: string) => void;
  onOpenLogin: (role: UserRole) => void;
  onOpenZip: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenLegal, onOpenLogin, onOpenZip }) => {
  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#06153d] text-slate-300 pt-12 pb-10 border-t border-slate-800 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-600 text-white flex items-center justify-center font-black text-lg">
                ✚
              </div>
              <span className="text-base font-black text-white tracking-tight">
                MYRA <span className="text-cyan-400">HomeCare</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {settings.businessName} — professional home care nursing services in Patna, Bihar. Better Care ❤️ Better Life.
            </p>
          </div>

          {/* Quick Contact & Numbers */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">
              Patna Helpline
            </h4>
            <div className="space-y-1.5 text-slate-300">
              <a href={`tel:+91${cleanPhone}`} className="block hover:text-cyan-400 font-bold">
                ☎ {settings.phone}
              </a>
              {settings.secondaryPhone && (
                <a href={`tel:+91${settings.secondaryPhone.replace(/[^0-9]/g, '')}`} className="block hover:text-cyan-400 font-bold">
                  ☎ {settings.secondaryPhone}
                </a>
              )}
              <a
                href={`https://wa.me/91${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-emerald-400 hover:underline"
              >
                💬 WhatsApp: {settings.phone}
              </a>
              <span className="block text-slate-400 text-[10px]">Patna, Bihar, India</span>
            </div>
          </div>

          {/* Policies & Disclaimers */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">
              Policies & Legal
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('refund')} className="hover:text-white transition-colors">
                  Cancellation & Refund
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('disclaimer')} className="hover:text-white transition-colors">
                  Medical Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* 24x7 Care Support */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">
              Care Coordination
            </h4>
            <div className="space-y-1.5 text-slate-400">
              <p className="text-[11px] leading-relaxed">
                Bedside nursing, patient attendants (GDA), and clinical procedures coordinated across all localities of Patna.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenLogin('manager')}
                  className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Staff & Duty Portal Access →</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar matching poster tagline */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <strong>MYRA Home Care Nursing Services</strong>
          <span>Better Care ❤️ Better Life · Because Your Health Matters</span>
          <span>Patna, Bihar · 24/7 Service</span>
        </div>
      </div>
    </footer>
  );
};
