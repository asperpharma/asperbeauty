import { useState } from 'react';
import { Send, X, Sparkles, ShieldCheck } from 'lucide-react'; // Brand Icons
import { supabase } from '@/integrations/supabase/client';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Marhaba! 🌿 I am Dr. Sami, your Digital Pharmacist. I am honored to serve you today. What is your primary skin concern?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // The "3-Click" Logic Connection
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
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
        content: data.response 
      }]);
    } catch (error) {
      console.error('Concierge Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "My apologies. The pharmacy connection is weak. Please try again." 
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
        style={{ backgroundColor: '#800020' }}
        aria-label="Open Digital Concierge"
      >
        <ShieldCheck className="w-5 h-5" style={{ color: '#C5A028' }} />
        <span className="text-white font-medium text-sm">Ask the Pharmacist</span>
      </button>

      {/* Clinical Luxury Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        style={{ 
          backgroundColor: '#F8F8FF', // Soft Ivory - Clinical Cleanliness
          border: '1px solid #C5A028'
        }}
      >
        {/* The Authority: Header with Maroon */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: '#800020' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(197, 160, 40, 0.2)' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: '#C5A028' }} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Asper Digital Clinic</h3>
              <p className="text-xs" style={{ color: '#C5A028' }}>Clinical Skincare Expert</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" style={{ color: '#C5A028' }} />
          </button>
        </div>

        {/* The Atmosphere: Messages Area with Soft Ivory */}
        <div 
          className="h-[320px] overflow-y-auto p-4 space-y-4"
          style={{ backgroundColor: '#F8F8FF' }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
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
                        backgroundColor: '#800020', 
                        color: '#FFFFFF' 
                      }
                    : { 
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #C5A028', // The "Gold Stitch" - Seal of Authenticity
                        color: '#333333'
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
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #C5A028'
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#C5A028' }} />
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#C5A028', animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#C5A028', animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area with Maroon Send Button */}
        <div 
          className="p-4 border-t"
          style={{ 
            backgroundColor: '#FFFFFF',
            borderTopColor: '#C5A028'
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
              className="flex-1 px-4 py-2 rounded-full border outline-none focus:ring-2 text-sm"
              style={{ 
                backgroundColor: '#F8F8FF',
                borderColor: '#C5A028',
                color: '#333333'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#C5A028';
                e.target.style.boxShadow = '0 0 0 2px rgba(197, 160, 40, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#C5A028';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ 
                backgroundColor: '#800020',
                width: '40px',
                height: '40px'
              }}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" style={{ color: '#C5A028' }} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
