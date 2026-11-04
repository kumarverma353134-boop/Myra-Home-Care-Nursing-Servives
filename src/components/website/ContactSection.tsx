import React, { useState } from 'react';
import { Phone, MessageCircle, Download, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SystemSettings } from '../../types';
import { storage } from '../../services/storage';

interface ContactSectionProps {
  settings: SystemSettings;
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings, onOpenBooking }) => {
  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const cleanSecPhone = (settings.secondaryPhone || '8893659849').replace(/[^0-9]/g, '');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('Boring Road, Patna');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // Save as support inquiry in database so Manager sees it
    storage.saveTicket({
      id: `tkt-inq-${Date.now()}`,
      ticketNumber: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      customerId: 'website-inquiry',
      customerName: name,
      customerPhone: phone,
      category: 'General Query',
      priority: 'Medium',
      subject: `New Web Enquiry from ${name} (${locality})`,
      description: `Locality: ${locality}\nMessage: ${message || 'No additional remarks.'}`,
      status: 'open',
      createdAt: new Date().toISOString()
    });

    setSubmitted(true);
  };

  return (
    <>
      {/* Contact & Booking Section matching user's template */}
      <section id="contact" className="py-12 sm:py-16 bg-[#050c1c] border-t border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-black text-xs uppercase tracking-widest">
            CONTACT & BOOKING · संपर्क करें
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tell Us What Care You Need
          </h2>

          <p className="text-xs sm:text-sm text-cyan-200/90 max-w-xl mx-auto leading-relaxed">
            For a booking request or quotation, call or WhatsApp our Patna desk. Please do not send sensitive medical documents or payment details to any unknown number.
          </p>

          {/* Clean Call & WhatsApp Buttons matching poster */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`tel:+91${cleanPhone}`}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 border border-emerald-400/30"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 {settings.phone}</span>
            </a>

            {settings.secondaryPhone && (
              <a
                href={`tel:+91${cleanSecPhone}`}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 border border-blue-400/30"
              >
                <Phone className="w-4 h-4" />
                <span>Call +91 {settings.secondaryPhone}</span>
              </a>
            )}

            <a
              href={`https://wa.me/91${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#0c1a36] text-white border border-cyan-500/40 font-extrabold text-xs sm:text-sm shadow-sm hover:bg-[#11244d] flex items-center gap-2 transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Direct Callback Form */}
          <div className="mt-8 bg-[#0c1a36] p-6 rounded-3xl border border-cyan-500/30 shadow-xl text-left max-w-xl mx-auto">
            <h3 className="text-sm font-extrabold text-white mb-1">
              Need a quick callback from our Patna Duty Manager?
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Leave your contact number and our manager will call you within 15 minutes.
            </p>

            {submitted ? (
              <div className="p-4 bg-emerald-950/70 rounded-xl border border-emerald-600/50 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-emerald-300">
                  Enquiry sent to Manager!
                </p>
                <p className="text-[11px] text-emerald-200">
                  We will call you on <strong>{phone}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-[#071228] text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-[#071228] text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Locality in Patna</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Boring Road, Kankarbagh, Bailey Road..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-[#071228] text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Instant Callback</span>
                </button>
              </form>
            )}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl mx-auto pt-2">
            {settings.emergencyDisclaimer || 'MYRA is a home-care service coordinator, not an emergency response replacement. For a medical emergency, contact local emergency services (108) or go to the nearest emergency department. Service requests are not confirmed until the team confirms availability and terms.'}
          </p>
        </div>
      </section>

      {/* Mobile App Download Section matching user's template */}
      <section id="app" className="py-12 bg-[#071228] border-t border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1a36] border border-cyan-900/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                settings.appAvailable ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'
              }`}>
                {settings.appAvailable ? 'APK AVAILABLE' : (settings.appStatusText || 'APP NOT AVAILABLE YET')}
              </span>

              <h3 className="text-xl font-extrabold text-white">
                {settings.appTitle || 'MYRA Mobile App'}
              </h3>

              <p className="text-xs text-slate-300 max-w-md">
                {settings.appDescription || 'The official app download will appear here when MYRA publishes a release.'}
              </p>

              {settings.appAvailable && settings.appVersion && (
                <span className="text-[11px] text-slate-400 block font-mono">
                  Version {settings.appVersion} · Android APK
                </span>
              )}
            </div>

            {settings.appAvailable && (
              <a
                href={settings.apkDownloadUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 shrink-0 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download APK</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
