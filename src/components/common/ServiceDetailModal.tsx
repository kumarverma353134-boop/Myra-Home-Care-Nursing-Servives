import React from 'react';
import { HealthcareService } from '../../types';
import { X, Check, Clock, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';

interface ServiceDetailModalProps {
  service: HealthcareService | null;
  onClose: () => void;
  onBook: (service: HealthcareService) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBook
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {service.category}
            </span>
            {service.badge && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {service.badge}
              </span>
            )}
          </div>

          <h2 id="service-modal-title" className="text-2xl font-bold tracking-tight text-white">
            {service.name}
          </h2>
          <p className="text-teal-300 text-sm font-medium mt-1">
            {service.hindiName}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Clinical Overview
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              {service.fullDesc}
            </p>
          </div>

          {/* Key Procedures Included */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Included Clinical Procedures
            </h3>
            <ul className="space-y-2.5">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-3" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Available Shifts */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Shift Durations Available in Patna
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.durationOptions.map((opt, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs"
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>

          {/* Document notice */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-emerald-900">
                Need to share doctor prescription or medical discharge summary?
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Version 1 enforces zero-upload privacy. Send documents directly on official WhatsApp.
              </p>
            </div>
            <a
              href={`https://wa.me/918893671162?text=Namaste%20MYRA%20HomeCare%2C%20here%20is%20the%20prescription%20for%20${encodeURIComponent(service.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Indicative Starting Fee</span>
            <div className="text-xl font-bold text-slate-900">
              ₹{service.startingPrice}
              <span className="text-xs font-normal text-slate-500 ml-1">/ shift/visit</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(service);
              }}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Book & Get Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
