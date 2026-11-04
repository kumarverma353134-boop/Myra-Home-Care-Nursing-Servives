import React from 'react';
import { ClipboardList, FileCheck, UserCheck2, HeartHandshake } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: ClipboardList,
      title: 'Submit Service Request',
      desc: 'Select from our 16 clinical services, specify shift duration (12h/24h/visit), patient condition, and your address in Patna.'
    },
    {
      num: '02',
      icon: FileCheck,
      title: 'Receive 72-Hour Quotation',
      desc: 'Our operations manager reviews nurse availability and sends an itemized quotation valid for 72 hours with zero commitment.'
    },
    {
      num: '03',
      icon: UserCheck2,
      title: 'Verified Staff Assignment',
      desc: 'Once accepted, a qualified nurse or attendant is assigned. You receive their verified clinical credentials and profile badge.'
    },
    {
      num: '04',
      icon: HeartHandshake,
      title: 'Care & Direct UPI / Cash',
      desc: 'Punctual home bedside service begins. Pay conveniently via verified UPI QR code or cash after service confirmation.'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-teal-800 tracking-wide mb-2">
            <span>Seamless Coordination</span>
            <span aria-hidden="true">·</span>
            <span>How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Arranging Reliable Home Nursing in 4 Simple Steps.
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            No endless phone calls or unverified workers. A disciplined, transparent healthcare booking workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => {
            const IconComp = st.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                      Step {st.num}
                    </span>
                    <IconComp className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
