import React from 'react';
import { ShieldCheck, Clock, Award, CreditCard, HeartPulse, UserCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: ShieldCheck,
      title: '100% Physically Audited Staff',
      desc: 'All nurses are verified with registered state nursing council credentials, background checks, and practical skills evaluations.'
    },
    {
      icon: Clock,
      title: '24×7 Patna Operations Desk',
      desc: 'Continuous coordination for night shifts, weekend relief, and emergency attendant needs across all residential areas of Patna.'
    },
    {
      icon: Award,
      title: 'Formal 72-Hour Quotations',
      desc: 'No vague pricing. You receive an itemized quotation valid for 72 hours with transparent shift rates before any commitment.'
    },
    {
      icon: CreditCard,
      title: 'Safe UPI & Cash Payments',
      desc: 'Pay directly via dynamic UPI QR code or cash on duty. Payments are personally verified by our operations manager.'
    },
    {
      icon: HeartPulse,
      title: 'Hospital-Grade Equipment Rental',
      desc: 'Doorstep delivery and certified technician setup for oxygen concentrators, BiPAP/CPAP, ICU beds, and suction units.'
    },
    {
      icon: UserCheck,
      title: 'Multiple Family Patient Profiles',
      desc: 'Manage nursing schedules for your parents, children, or spouse from a single account with separated care records.'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-teal-800 tracking-wide mb-2">
            <span>The MYRA Standard</span>
            <span aria-hidden="true">·</span>
            <span>Why Patna Families Trust Us</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Setting the Benchmark for Professional Home Nursing in Bihar.
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            We bridge the gap between hospital discharge and complete home recovery with discipline, safety protocols, and empathy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((pt, idx) => {
            const IconComp = pt.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-500 hover:shadow-md transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <IconComp className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  {pt.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
