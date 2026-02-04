import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Youtube, Zap, X, Terminal, Mic, Cpu, Globe, Shield, Loader2 } from 'lucide-react';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const AskAi = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false); // New State
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
      setIsVideoLoading(true); // Start Loader
      setActiveVideo(null); // Clear previous video
      
      const videoId = await searchYouTube(userQuery);
      
      // Artificial delay for "Neural Link" feel
      setTimeout(() => {
        setIsTyping(false);
        setIsVideoLoading(false); // Stop Loader
        setActiveVideo(videoId);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Visual uplink established. Re-routing data stream to main HUD.",
        }]);
      }, 1500);
    } else {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Query processed. I am monitoring all available data nodes for your request." 
        }]);
      }, 900);
    }
  };

  return (
    <div className="h-screen w-full bg-[#020202] text-zinc-400 flex flex-col lg:flex-row overflow-hidden font-mono p-4 gap-4">
      
      {/* --- BACKGROUND DECOR --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* --- LEFT: SYSTEM MONITOR & VIDEO (60%) --- */}
      <section className="flex-[1.4] relative flex flex-col gap-4">
        {/* Top Status Bar */}
        <div className="h-14 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center px-6 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Cpu size={14} className={isVideoLoading ? "text-red-500 animate-spin" : "text-red-500"} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                {isVideoLoading ? "Processing Uplink..." : "Core: 98%"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-zinc-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Uplink: Active</span>
            </div>
          </div>
        </div>

        {/* Video Viewport / Loader Area */}
        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group backdrop-blur-sm shadow-inner">
          
          <AnimatePresence mode="wait">
            {isVideoLoading ? (
              /* --- THE LOADER --- */
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center bg-black/40 backdrop-blur-md"
              >
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute w-48 h-48 border-t border-b border-red-500/30 rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute w-40 h-40 border-l border-r border-red-600/50 rounded-full"
                  />
                  <div className="relative z-10 flex flex-col items-center">
                    <Loader2 size={40} className="text-red-500 animate-spin mb-4" />
                    <span className="text-[10px] font-black tracking-[0.5em] uppercase text-red-500 animate-pulse">
                      Intercepting Satellite Signal
                    </span>
                  </div>
                </div>
                {/* HUD Scan Line */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div 
                      animate={{ y: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-full h-[2px] bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    />
                </div>
              </motion.div>

            ) : activeVideo ? (
              /* --- THE VIDEO --- */
              <motion.div 
                key="video"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full flex flex-col"
              >
                 <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <div className="bg-red-600 px-3 py-1 rounded text-[10px] text-white font-black animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]">LIVE VIEW</div>
                    <button onClick={() => setActiveVideo(null)} className="bg-black/50 hover:bg-red-600 p-1 rounded transition-colors text-white backdrop-blur-md">
                      <X size={14} />
                    </button>
                 </div>
                 <iframe
                  width="100%" height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1&modestbranding=1`}
                  frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen
                />
              </motion.div>
            ) : (
              /* --- IDLE STATE --- */
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col items-center justify-center opacity-40"
              >
                <Terminal size={48} className="mb-4 text-zinc-800" />
                <p className="text-[10px] tracking-[0.4em] uppercase font-black text-zinc-600 italic underline underline-offset-8">No Visual Data Inbound</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* --- RIGHT: CHAT CORE --- */}
      <section className="flex-1 bg-white/[0.03] border border-white/10 rounded-3xl flex flex-col relative backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
              <span className="text-xs font-black tracking-widest text-white uppercase">Neural_Interface_v1</span>
           </div>
           <Shield size={16} className="text-zinc-700" />
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col justify-end pb-10">
              <Sparkles className="text-red-500 mb-4 animate-pulse" size={24} />
              <h2 className="text-2xl font-bold text-white mb-2 italic">System Initialized.</h2>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-[250px]">
                I am your AI bridge. Try: <span className="text-red-500/80 italic">"Show me futuristic Tokyo"</span>
              </p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] border backdrop-blur-md ${
                  msg.role === 'user' 
                  ? 'bg-white/5 border-white/10 text-white rounded-tr-none' 
                  : 'bg-red-600/10 border-red-500/20 text-red-100 rounded-tl-none'
                }`}>
                   <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] font-bold uppercase tracking-tighter">
                      {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                      {msg.role}
                   </div>
                   {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && <div className="text-[10px] text-red-500 animate-pulse font-bold tracking-[0.2em] px-2 italic font-mono">ENCRYPTING_QUERY...</div>}
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-black/20">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 pr-3 focus-within:border-red-500/50 transition-all hover:bg-white/[0.07]"
          >
            <input 
              type="text"
              placeholder="Root command..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[13px] py-3 px-4 text-white placeholder:text-zinc-700 font-mono"
            />
            <button 
              disabled={!input.trim() || isVideoLoading}
              className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-20 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              <Send size={16} />
            </button>
          </form>
          <div className="mt-4 flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-700">
             <span>Security: E2E ENCRYPTED</span>
             <span>Ping: 24ms</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AskAi;