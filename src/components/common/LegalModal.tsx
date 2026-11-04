import React from 'react';
import { X, ShieldAlert, FileText } from 'lucide-react';

interface LegalModalProps {
  pageKey: string | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ pageKey, onClose }) => {
  if (!pageKey) return null;

  let title = 'Legal Document';
  let content: React.ReactNode = null;

  if (pageKey === 'privacy') {
    title = 'Privacy Policy — MYRA Home Care';
    content = (
      <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p>
          At <strong>MYRA Home Care Nursing Services</strong> (Patna, Bihar), we are deeply dedicated to safeguarding patient confidentiality and family medical data.
        </p>
        <h4 className="font-bold text-slate-900 text-sm">1. Zero Web Document Storage Policy</h4>
        <p>
          To maintain zero-budget compliance and prevent potential cloud data leakage, Version 1 of our web platform does not accept or store medical files, prescriptions, or laboratory diagnostic PDFs. All clinical documents must be securely transmitted directly via our encrypted official WhatsApp helpline (+91 8893671162).
        </p>
        <h4 className="font-bold text-slate-900 text-sm">2. Information We Collect</h4>
        <p>
          We collect only strictly necessary details required for home nursing dispatch: contact phone number, service address in Patna, patient age, relation, and non-sensitive bedside care notes.
        </p>
        <h4 className="font-bold text-slate-900 text-sm">3. Account Erasure & Deletion</h4>
        <p>
          Customers may request full account deletion via their Customer Dashboard. Upon Owner review, patient profiles and residential addresses are permanently expunged.
        </p>
      </div>
    );
  } else if (pageKey === 'terms') {
    title = 'Terms & Conditions — MYRA HomeCare';
    content = (
      <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h4 className="font-bold text-slate-900 text-sm">1. Service Nature</h4>
        <p>
          MYRA Home Care coordinates verified nurses and attendants for home bedside care. While services can be requested 24×7, actual dispatch is subject to staff availability and confirmation by our operations manager.
        </p>
        <h4 className="font-bold text-slate-900 text-sm">2. 72-Hour Formal Quotation</h4>
        <p>
          Every quotation issued by MYRA Operations is binding for 72 hours from the generation timestamp. After 72 hours, an expired quotation requires re-confirmation.
        </p>
        <h4 className="font-bold text-slate-900 text-sm">3. Direct Payments</h4>
        <p>
          Payments are accepted only via configured business UPI or cash on duty. Customers must submit a valid bank UTR for verification.
        </p>
      </div>
    );
  } else if (pageKey === 'refund') {
    title = 'Cancellation & Refund Policy';
    content = (
      <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h4 className="font-bold text-slate-900 text-sm">1. Shift Cancellation Window</h4>
        <p>
          Scheduled bedside shifts may be cancelled free of charge up to 4 hours prior to the scheduled start time through the Customer Dashboard or by calling 8893671162.
        </p>
        <h4 className="font-bold text-slate-900 text-sm">2. Operational Refunds</h4>
        <p>
          In the event an assigned nurse is unable to attend and a suitable replacement cannot be deployed in Patna, any advance UPI payment is refunded in full directly to the customer's source account within 24–48 banking hours.
        </p>
      </div>
    );
  } else if (pageKey === 'disclaimer') {
    title = 'Medical Disclaimer';
    content = (
      <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 font-medium">
          ⚠️ CRITICAL: MYRA Home Care provides supportive bedside nursing and home care attendant services. We are NOT an ambulance service, emergency hospital, or diagnostic clinical laboratory.
        </div>
        <p>
          In acute life-threatening situations (severe chest pain, respiratory distress, profuse bleeding, or acute trauma), families must immediately dial <strong>108 Ambulance</strong> or transport the patient to the nearest hospital casualty emergency room.
        </p>
        <p>
          All injections, IV infusions, and tracheostomy procedures are performed strictly under the written prescription of the patient's licensed treating physician.
        </p>
      </div>
    );
  } else {
    title = 'Contact & Support Policy';
    content = (
      <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p>
          Our Patna Operations Desk maintains dedicated response targets:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>High Priority Clinical Queries:</strong> Response within 15 minutes.</li>
          <li><strong>Medium Priority Scheduling:</strong> Response within 1 hour.</li>
          <li><strong>General Inquiries & Billing:</strong> Response within 24 hours.</li>
        </ul>
        <p>
          Direct telephone support is active 24×7 at <strong>8893671162</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 overflow-hidden shadow-2xl">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm tracking-tight text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {content}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
