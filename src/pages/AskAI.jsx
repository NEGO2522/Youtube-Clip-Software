import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Youtube, Zap, X, Terminal, Mic, Cpu, Globe, Shield, Loader2 } from 'lucide-react';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const AskAi = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
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
    } catch (error) { 
      console.error("YT Error:", error);
      return null; 
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input;
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput("");
    setIsTyping(true);

    // ALWAYS trigger video search now
    setActiveVideo(null); 
    setIsVideoLoading(true);
    
    const videoId = await searchYouTube(userQuery);
    
    // Aesthetic delay for "Neural Link" sync
    setTimeout(() => {
      setIsTyping(false);
      setIsVideoLoading(false);
      
      if (videoId) {
        setActiveVideo(videoId);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Visual uplink locked. Synchronizing stream for "${userQuery}".`,
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Critical Error: Could not establish stable video uplink for this query.",
        }]);
      }
    }, 1500);
  };

  return (
    <div className="h-screen w-full bg-[#020202] text-zinc-400 flex flex-col lg:flex-row overflow-hidden font-mono p-4 gap-4 selection:bg-red-500/30">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* --- LEFT: SYSTEM MONITOR & VIDEO --- */}
      <section className="flex-[1.4] relative flex flex-col gap-4">
        <div className="h-14 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center px-6 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Cpu size={14} className={isVideoLoading ? "text-red-500 animate-spin" : "text-red-500"} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                {isVideoLoading ? "Establishing Feed..." : "Core: Online"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Globe size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Global Link Active</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden backdrop-blur-sm shadow-2xl">
          <AnimatePresence mode="wait">
            {isVideoLoading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center bg-black/60 relative z-50"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="w-32 h-32 border-2 border-red-500/10 border-t-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={24} className="text-red-500 animate-spin" />
                  </div>
                </div>
                <div className="mt-6 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black tracking-[0.4em] text-red-500 animate-pulse">ANALYZING SIGNAL</span>
                  <span className="text-[8px] text-zinc-700 font-mono uppercase tracking-widest">Bypassing encryption nodes...</span>
                </div>
              </motion.div>
            ) : activeVideo ? (
              <motion.div 
                key="video"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full flex flex-col relative"
              >
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <div className="bg-red-600 px-3 py-1 rounded text-[10px] text-white font-black animate-pulse">DATA_STREAM: LIVE</div>
                  <button onClick={() => setActiveVideo(null)} className="bg-black/80 hover:bg-red-600 p-1.5 rounded transition-all text-white border border-white/10 backdrop-blur-md">
                    <X size={14} />
                  </button>
                </div>
                <iframe
                  width="100%" height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1&modestbranding=1`}
                  frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen
                  className="grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full border border-zinc-900 flex items-center justify-center">
                   <Terminal size={24} className="text-zinc-800" />
                </div>
                <p className="mt-4 text-[9px] tracking-[0.6em] uppercase font-black text-zinc-800">No stream detected</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* --- RIGHT: CHAT CORE --- */}
      <section className="flex-1 bg-white/[0.03] border border-white/10 rounded-3xl flex flex-col relative backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
              <span className="text-[11px] font-black tracking-[0.2em] text-white uppercase">Neural_Uplink_v2</span>
           </div>
           <Shield size={16} className="text-zinc-700" />
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col justify-end pb-12">
              <Sparkles className="text-red-600 mb-4" size={24} />
              <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">System Ready.</h2>
              <p className="text-[11px] text-zinc-600 leading-relaxed max-w-[220px] font-bold uppercase">
                Input any topic. Interface will auto-locate relevant visual data.
              </p>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] border backdrop-blur-xl ${
                  msg.role === 'user' 
                  ? 'bg-white/5 border-white/10 text-white rounded-tr-none' 
                  : 'bg-red-600/10 border-red-500/20 text-red-50 rounded-tl-none font-sans'
                }`}>
                   <div className="flex items-center gap-2 mb-2 opacity-40 text-[9px] font-bold uppercase tracking-widest font-mono">
                      {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                      {msg.role}
                   </div>
                   {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && <div className="text-[9px] text-red-500 animate-pulse font-black tracking-[0.3em] px-2 italic uppercase">Synchronizing...</div>}
        </div>

        <div className="p-6 bg-black/40">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-2xl p-2 pr-3 focus-within:border-red-500/50 transition-all shadow-inner"
          >
            <input 
              type="text"
              placeholder="Query any topic..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[13px] py-3 px-4 text-white placeholder:text-zinc-800 font-mono tracking-tight"
            />
            <button 
              disabled={!input.trim() || isVideoLoading}
              className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-10 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            >
              <Send size={16} />
            </button>
          </form>
          <div className="mt-4 flex justify-between text-[8px] font-black uppercase tracking-[0.3em] text-zinc-800">
             <span>Security: E2E</span>
             <span>Link: Stable</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AskAi;