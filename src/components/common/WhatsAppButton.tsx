import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/918893671162?text=Namaste%20MYRA%20HomeCare%2C%20I%20need%20nursing%20care%20services%20in%20Patna."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 group"
      aria-label="Contact MYRA HomeCare on WhatsApp"
      title="Chat on WhatsApp / Share Prescriptions (8893671162)"
    >
      <MessageCircle className="w-6 h-6 fill-current text-white" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold pr-1">
        WhatsApp 8893671162
      </span>
    </a>
  );
};
