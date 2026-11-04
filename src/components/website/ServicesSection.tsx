import React from 'react';
import { HealthcareService } from '../../types';

interface ServicesSectionProps {
  services: HealthcareService[];
  onSelectService: (service: HealthcareService) => void;
  onBookService: (service: HealthcareService) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
  onBookService
}) => {
  return (
    <section id="services" className="py-12 sm:py-16 bg-[#050c1c] transition-colors border-t border-b border-cyan-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header matching user's uploaded poster */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-block px-4 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-black text-xs uppercase tracking-widest shadow-xs">
            हमारी सेवाएं · OUR CARE SERVICES
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Healthcare Support at Home
          </h2>
          <p className="text-xs sm:text-sm text-cyan-200/90 leading-relaxed font-medium">
            आपके भरोसेमंद साथी — घर पर ही बेहतर ईलाज। Select any service or call directly to confirm staff availability and timing in Patna.
          </p>
        </div>

        {/* 4-Column Grid with dark cards and bilingual badges matching poster */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {services.map((service) => (
            <article
              key={service.id}
              onClick={() => onSelectService(service)}
              className="bg-[#0c1a36] border border-cyan-950 hover:border-cyan-500/50 rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Emoji Icon Container matching poster */}
                <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700 text-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-cyan-400 transition-all shadow-sm">
                  {service.icon || '🩺'}
                </div>

                {/* Service Name (English) */}
                <h3 className="text-sm sm:text-base font-extrabold text-white mb-0.5 leading-snug group-hover:text-cyan-300 transition-colors">
                  {service.name}
                </h3>

                {/* Hindi Name Badge matching poster */}
                {service.hindiName && (
                  <span className="inline-block text-[11px] font-black text-emerald-400 mb-2">
                    {service.hindiName}
                  </span>
                )}

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
                  {service.shortDesc}
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-extrabold text-cyan-400">
                  ₹{service.startingPrice}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookService(service);
                  }}
                  className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-600 hover:text-white transition-all shadow-xs"
                >
                  Book Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
