import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Trash2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { MyraAssistantEngine, AssistantResponse } from '../../services/assistantEngine';
import { HealthcareService } from '../../types';

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  detectedService?: HealthcareService;
  isBookingCard?: boolean;
}

interface MyraCareAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectServiceToBook?: (service: HealthcareService) => void;
}

export const MyraCareAssistantModal: React.FC<MyraCareAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectServiceToBook
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    return [
      {
        id: 'msg-init',
        sender: 'assistant',
        text: MyraAssistantEngine.getGreeting(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          '12/24 Hr Bedside Nursing',
          'ICU Setup at Home',
          'Elderly Care',
          'Physiotherapy',
          'How does payment work?',
          'Share prescription on WhatsApp'
        ]
      }
    ];
  });
  const [input, setInput] = useState('');
  const [autoSaveHistory, setAutoSaveHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Process rule-based NLP query (₹0 cost, instant)
    setTimeout(() => {
      const res: AssistantResponse = MyraAssistantEngine.processQuery(query);
      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggestedActions,
        detectedService: res.detectedService
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 350);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: MyraAssistantEngine.getGreeting(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: ['12/24 Hr Bedside Nursing', 'ICU Setup at Home', 'Elderly Care', 'Payment Info']
      }
    ]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onClose}
        className="fixed bottom-6 right-6 z-40 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-xl hover:shadow-teal-500/25 hover:scale-105 transition-all flex items-center gap-2 group"
        aria-label="Open MYRA Care Assistant"
        title="MYRA Care Assistant (Free Rule-Based Assistant)"
      >
        <Bot className="w-6 h-6 text-white" />
        <span className="hidden md:inline text-xs font-semibold pr-1">
          MYRA Care Assistant
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[580px] max-h-[85vh] animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow">
            <Bot className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight text-white">MYRA Care Assistant</h3>
              <span className="bg-teal-900/80 text-teal-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-teal-700">
                Free & Instant
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Hindi · English · Hinglish Guidance</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line text-xs sm:text-sm">
                {msg.text}
              </div>

              {/* Detected Service Action Card */}
              {msg.detectedService && (
                <div className="mt-3 p-3 bg-teal-50/80 rounded-xl border border-teal-100 text-slate-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-teal-900">
                      {msg.detectedService.name}
                    </span>
                    <span className="text-xs font-bold text-teal-700">
                      ₹{msg.detectedService.startingPrice} onwards
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Available in Patna · 24×7 Nurse Scheduling
                  </p>
                  <button
                    onClick={() => {
                      if (onSelectServiceToBook && msg.detectedService) {
                        onSelectServiceToBook(msg.detectedService);
                      }
                    }}
                    className="w-full py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Request Quotation for this Service</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <span
                className={`block text-[10px] mt-1.5 ${
                  msg.sender === 'user' ? 'text-teal-100 text-right' : 'text-slate-400 text-left'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {/* Suggested Action Chips */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                {msg.suggestedActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (action.includes('WhatsApp')) {
                        window.open('https://wa.me/918893671162', '_blank');
                      } else {
                        handleSend(action);
                      }
                    }}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 text-slate-700 rounded-lg border border-slate-200 transition-all shadow-2xs font-medium text-left"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Type your question in Hindi or English..."
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-sm"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            Rule-based zero-cost assistant (No paid AI)
          </span>
          <button
            onClick={() => setAutoSaveHistory(!autoSaveHistory)}
            className="hover:text-slate-600 transition-colors"
          >
            Memory: <strong className={autoSaveHistory ? 'text-teal-600' : 'text-slate-400'}>{autoSaveHistory ? 'ON' : 'OFF'}</strong>
          </button>
        </div>
      </div>
    </div>
  );
};
