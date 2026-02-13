import { useState } from 'react';
import { Send, X, Sparkles, ShieldCheck } from 'lucide-react'; // Brand Icons
import { supabase } from '@/integrations/supabase/client';

// Design Tokens - Clinical Luxury Interface
const COLORS = {
  ivory: '#F8F8FF',      // Soft Ivory - Clinical Cleanliness
  maroon: '#800020',     // Maroon - Medical Authority
  gold: '#C5A028',       // Shiny Gold - Seal of Authenticity
  charcoal: '#333333',   // Dark Charcoal - Text
  white: '#FFFFFF',      // White - Message Backgrounds
};

// Initial greeting message
const INITIAL_MESSAGE = {
  role: 'assistant' as const,
  content: "Marhaba! 🌿 I am Dr. Sami, your Digital Pharmacist. I am honored to serve you today. What is your primary skin concern?"
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // The "3-Click" Logic Connection
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { 
      role: 'user', 
      content: input,
      id: `user-${Date.now()}`
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Connects to the Supabase Brain we just deployed
      const { data, error } = await supabase.functions.invoke('beauty-assistant', {
        body: { query: input, history: newMessages }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        id: `assistant-${Date.now()}`
      }]);
    } catch (error) {
      console.error('Concierge Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "My apologies. The pharmacy connection is weak. Please try again.",
        id: `error-${Date.now()}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* The "Velvet Rope": Toggle Button with Maroon & Gold */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{ backgroundColor: COLORS.maroon }}
        aria-label="Open Digital Concierge"
      >
        <ShieldCheck className="w-5 h-5" style={{ color: COLORS.gold }} />
        <span className="text-white font-medium text-sm">Ask the Pharmacist</span>
      </button>

      {/* Clinical Luxury Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        style={{ 
          backgroundColor: COLORS.ivory, // Soft Ivory - Clinical Cleanliness
          border: `1px solid ${COLORS.gold}`
        }}
      >
        {/* The Authority: Header with Maroon */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: COLORS.maroon }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(197, 160, 40, 0.2)' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: COLORS.gold }} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Asper Digital Clinic</h3>
              <p className="text-xs" style={{ color: COLORS.gold }}>Clinical Skincare Expert</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" style={{ color: COLORS.gold }} />
          </button>
        </div>

        {/* The Atmosphere: Messages Area with Soft Ivory */}
        <div 
          className="h-[320px] overflow-y-auto p-4 space-y-4"
          style={{ backgroundColor: COLORS.ivory }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id || `${msg.role}-${msg.content.substring(0, 20)}`}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'rounded-br-sm'
                    : 'rounded-bl-sm'
                }`}
                style={
                  msg.role === 'user'
                    ? { 
                        backgroundColor: COLORS.maroon, 
                        color: COLORS.white 
                      }
                    : { 
                        backgroundColor: COLORS.white,
                        border: `1px solid ${COLORS.gold}`, // The "Gold Stitch" - Seal of Authenticity
                        color: COLORS.charcoal
                      }
                }
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div
                className="max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-3"
                style={{ 
                  backgroundColor: COLORS.white,
                  border: `1px solid ${COLORS.gold}`
                }}
              >
                <div className="flex items-center gap-2">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div 
                      key={i}
                      className="w-2 h-2 rounded-full animate-pulse" 
                      style={{ 
                        backgroundColor: COLORS.gold,
                        animationDelay: `${delay}s`
                      }} 
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area with Maroon Send Button */}
        <div 
          className="p-4 border-t"
          style={{ 
            backgroundColor: COLORS.white,
            borderTopColor: COLORS.gold
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your skin concern..."
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-full border outline-none focus:ring-2 focus:ring-opacity-20 text-sm transition-shadow"
              style={{ 
                backgroundColor: COLORS.ivory,
                borderColor: COLORS.gold,
                color: COLORS.charcoal,
                // @ts-ignore - CSS custom property
                '--tw-ring-color': COLORS.gold
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ 
                backgroundColor: COLORS.maroon,
                width: '40px',
                height: '40px'
              }}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" style={{ color: COLORS.gold }} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
