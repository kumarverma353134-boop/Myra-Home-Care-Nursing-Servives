import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How quickly can a nurse or attendant reach my home in Patna?',
      a: 'For urgent requirements (ASAP bookings), our operations manager coordinates dispatch within 60–90 minutes depending on your ward (e.g. Boring Road, Bailey Road, Kankarbagh). For scheduled 12/24-hour shifts, bookings should ideally be confirmed 12 hours in advance.'
    },
    {
      q: 'Are your nurses registered and verified?',
      a: 'Yes. Every clinical nurse at MYRA holds recognized nursing qualifications (B.Sc Nursing or GNM) registered with the state nursing council. Our business administrator physically audits diplomas, ID proofs, and clinical background before approving their profile.'
    },
    {
      q: 'How does payment work? Can I pay using UPI or cash?',
      a: 'Version 1 supports 100% free, direct payment methods: Cash on Duty and UPI (Google Pay, PhonePe, Paytm). After the manager issues a formal 72-hour quotation and service is delivered, you can scan the dynamic UPI QR code in your dashboard, submit the UTR / Transaction ID, and receive a verified receipt.'
    },
    {
      q: 'Can I upload my doctor prescription or medical discharge summary on the website?',
      a: 'In Version 1, for maximum patient privacy and zero-budget compliance, we do not store customer medical documents or PDFs on the web server. Instead, we provide a direct WhatsApp button to send prescriptions directly to our official business WhatsApp (+91 8893671162).'
    },
    {
      q: 'Can one account manage care for multiple family members?',
      a: 'Absolutely! From your single Google account, you can create separate patient profiles for your Father, Mother, Child, or Spouse with individual medical conditions, care instructions, and booking histories.'
    },
    {
      q: 'What is your cancellation or reschedule policy?',
      a: 'You can request a schedule change through your Customer Dashboard. If you need to cancel a shift, please inform us at least 4 hours before the shift start time without any cancellation penalty.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-teal-800 tracking-wide mb-2">
            <span>Got Questions?</span>
            <span aria-hidden="true">·</span>
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Clear Answers for Your Family’s Peace of Mind.
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Everything you need to know about our services, verification, pricing, and scheduling.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-sm text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
          <p className="text-xs font-semibold text-emerald-950">
            Have a specific clinical requirement not listed above?
          </p>
          <a
            href="https://wa.me/918893671162"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Directly with Manager on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
