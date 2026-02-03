import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Youtube, Zap, X, Terminal, Mic } from 'lucide-react';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const AskAi = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const searchYouTube = async (query) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      return data.items[0] ? data.items[0].id.videoId : null;
    } catch (error) { return null; }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input;
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput("");
    setIsTyping(true);

    if (userQuery.toLowerCase().match(/video|show|play|find/)) {
      const videoId = await searchYouTube(userQuery);
      setTimeout(() => {
        setIsTyping(false);
        setActiveVideo(videoId);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Neural link established. Visual data stream is now active in your primary viewport.",
        }]);
      }, 1000);
    } else {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I've analyzed your request. I can pull up relevant video streams or answer questions regarding your data." 
        }]);
      }, 800);
    }
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-zinc-300 flex overflow-hidden font-sans">
      
      {/* --- SIDEBAR VISION PANEL (Left 55%) --- */}
      <section className="hidden lg:flex flex-[1.2] relative border-r border-white/5 bg-[#080808] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent pointer-events-none" />
        
        {activeVideo ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Youtube className="text-red-600" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Active Stream</span>
              </div>
              <button 
                onClick={() => setActiveVideo(null)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black relative group">
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                frameBorder="0" allowFullScreen
              />
            </div>
          </motion.div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-20 text-center">
            <div className="w-24 h-24 mb-8 rounded-full border border-dashed border-zinc-800 flex items-center justify-center">
              <Terminal className="text-zinc-800" size={32} />
            </div>
            <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Waiting for visual input</h2>
            <p className="text-zinc-700 text-xs mt-4 max-w-xs">Ask the AI to show you a video to initialize the primary viewport.</p>
          </div>
        )}
      </section>

      {/* --- CHAT INTERFACE (Right 45%) --- */}
      <section className="flex-1 flex flex-col relative bg-[#050505]">
        
        {/* Header */}
        <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-red-600 fill-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Clupe Core v4.1</span>
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {messages.length === 0 && (
            <div className="py-20 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles size={12} /> AI Powered
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">System <br/>Intelligence.</h1>
              <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
                Commands: "Show me a video of...", "Find a tutorial for...", or simply ask a question.
              </p>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  msg.role === 'user' ? 'bg-zinc-900 border-white/10' : 'bg-red-600 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                }`}>
                  {msg.role === 'user' ? <User size={14} className="text-zinc-400" /> : <Bot size={14} className="text-white" />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-white/5 border border-white/5 text-zinc-300' : 'text-white font-medium'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-2 p-4">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 bg-[#050505]">
          <form 
            onSubmit={handleSend}
            className="relative flex items-center bg-[#0d0d0d] border border-white/5 rounded-2xl p-1.5 focus-within:border-red-600/40 transition-all shadow-2xl"
          >
            <div className="pl-4 text-zinc-600">
                <Mic size={16} />
            </div>
            <input 
              type="text"
              placeholder="Initialize command..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm py-4 px-4 text-white placeholder:text-zinc-700"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="p-4 bg-red-600 text-white rounded-xl hover:bg-white hover:text-black transition-all disabled:opacity-20 disabled:grayscale"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="text-center text-[9px] text-zinc-700 mt-4 uppercase font-bold tracking-[0.2em]">
            Clupe Neural Interface // Secure Connection
          </p>
        </div>
      </section>
    </div>
  );
};

export default AskAi;