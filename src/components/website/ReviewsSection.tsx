import React from 'react';
import { CustomerReview } from '../../types';
import { Star, MessageSquare } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-teal-800 tracking-wide mb-2">
            <span>Verified Patient Feedback</span>
            <span aria-hidden="true">·</span>
            <span>Owner Approved Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved & Trusted by Families Across Patna.
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Real experiences from families who entrusted their parents, newborns, and recovering loved ones to MYRA nurses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array(rev.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{rev.reviewText}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-slate-900">{rev.customerName}</h3>
                  <span className="text-[11px] text-teal-700 font-medium block">
                    {rev.serviceName}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
