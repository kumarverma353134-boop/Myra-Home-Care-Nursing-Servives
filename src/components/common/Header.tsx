import React, { useState } from 'react';
import { Menu, X, Phone, Sun, Moon, Plus, ChevronRight } from 'lucide-react';
import { UserRole, SystemSettings } from '../../types';

interface HeaderProps {
  settings: SystemSettings;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenLogin: (preferredRole?: UserRole) => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  isDarkMode,
  onToggleDarkMode,
  onNavigate,
  onOpenLogin,
  onOpenBooking
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner Bar with Poster Tagline */}
      <div className="bg-[#040f28] text-white px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-cyan-950">
        <span className="font-semibold tracking-wide flex items-center gap-1.5 text-cyan-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <strong className="text-white">MYRA Home Care</strong> — आपके भरोसेमंद साथी · घर पर ही बेहतर ईलाज
        </span>
        <div className="flex items-center gap-4 text-slate-300">
          <span className="hidden sm:inline">Patna, Bihar · 24/7 Helpline:</span>
          <a
            href={`tel:+91${settings.phone.replace(/[^0-9]/g, '')}`}
            className="text-emerald-400 font-extrabold hover:underline flex items-center gap-1"
          >
            <span>☎ +91 {settings.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#071228]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-20">
            {/* Brand Logo matching template */}
            <button
              onClick={() => handleNavClick('hero')}
              className="flex items-center gap-3 text-left group whitespace-nowrap shrink-0"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
                ✚
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-[#071b50] dark:text-white block leading-tight">
                  MYRA
                </span>
                <span className="text-[10px] font-extrabold tracking-widest text-slate-500 dark:text-cyan-400 block uppercase">
                  HOME CARE NURSING SERVICES
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-700 dark:text-slate-300">
              <button
                onClick={() => handleNavClick('services')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('team')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              >
                Our Team
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              >
                Contact
              </button>
              <button
                onClick={() => handleNavClick('app')}
                className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
              >
                App Download
              </button>
            </nav>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2.5">
              {/* Dark / Light Mode Switch */}
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 text-xs font-bold"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-yellow-400" />
                    <span className="hidden lg:inline text-slate-200">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-700" />
                    <span className="hidden lg:inline text-slate-700">Dark</span>
                  </>
                )}
              </button>

              {/* Login / Dashboard */}
              <button
                onClick={() => onOpenLogin('customer')}
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Login / Portals
              </button>

              {/* Primary Call Now Button matching template */}
              <a
                href={`tel:+91${settings.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-700/25 transition-all whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                <span>☎ Call Now</span>
              </a>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071228] px-4 py-4 space-y-3 shadow-xl">
            <nav className="flex flex-col space-y-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              <button
                onClick={() => handleNavClick('services')}
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Services (16)
              </button>
              <button
                onClick={() => handleNavClick('team')}
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Our Team & Helpline
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Contact & Booking
              </button>
              <button
                onClick={() => handleNavClick('app')}
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Mobile App Download
              </button>
            </nav>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                Request Service Online
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin('customer');
                }}
                className="w-full py-2 text-center text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Dashboards / Sign In
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
