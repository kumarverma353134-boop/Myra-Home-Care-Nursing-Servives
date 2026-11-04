import React from 'react';
import { MapPin, Phone, CheckCircle2 } from 'lucide-react';

export const CoverageSection: React.FC = () => {
  const localities = [
    'East & West Boring Canal Road',
    'Kankarbagh Colony & Doctors Colony',
    'Bailey Road (Raja Bazar & Ashiana)',
    'Patliputra Colony & Gosaintola',
    'Rajendra Nagar & Kadamkuan',
    'Danapur Cantt & Saguna More',
    'Anisabad, Phulwari Sharif & AIIMS area',
    'Exhibition Road & Gandhi Maidan',
    'SK Puri, Kidwaipuri & Boring Road Crossing',
    'Digha, Kurji & Rajiv Nagar',
    'Gola Road & RPS More',
    'Hanuman Nagar & Malahi Pakri'
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Service Coverage</span>
              <span aria-hidden="true">·</span>
              <span>Patna Municipal Corporation</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Rapid Nurse Dispatch Across All Sectors of Patna.
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Our clinical caregivers and medical equipment technicians are stationed across central, northern, and western zones of Patna to ensure minimal response times for emergency dressings, post-operative shifts, and daily attendant requirements.
            </p>

            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-xs text-teal-950 space-y-2">
              <div className="font-bold flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-700" />
                <span>Need Urgent Assistance in Your Ward?</span>
              </div>
              <p className="text-[11px] text-teal-800">
                Call our direct Patna control desk at <strong>8893671162</strong> or message on WhatsApp for immediate staff availability check.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Key Wards & Residential Localities Covered in Patna
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {localities.map((loc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="truncate">{loc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
