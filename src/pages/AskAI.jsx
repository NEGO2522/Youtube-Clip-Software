import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Youtube, Zap, X, Terminal, Mic, Cpu, Globe, Shield, Loader2, List, Activity, HardDrive, Hash } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // Import useLocation

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const AskAi = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [startTime, setStartTime] = useState(0); 
  const [chapters, setChapters] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const location = useLocation(); // Hook to catch the state
  const hasInitialized = useRef(false); // To prevent double-triggering in development

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // NEW: Handle incoming query from Landing Page
  useEffect(() => {
    if (location.state?.initialQuery && !hasInitialized.current) {
      const query = location.state.initialQuery;
      performSearch(query);
      hasInitialized.current = true;
    }
  }, [location.state]);

  const parseTimestamp = (text) => {
    const timeMatch = text.match(/(\d+):(\d+):?(\d+)?/);
    if (!timeMatch) return 0;
    const parts = timeMatch[0].split(':').map(Number);
    if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    if (parts.length === 2) return (parts[0] * 60) + parts[1];
    return 0;
  };

  const extractChapters = (description) => {
    const lines = description.split('\n');
    const detected = [];
    const timeRegex = /(\d{1,2}:\d{2}(?::\d{2})?)/;
    lines.forEach(line => {
      const match = line.match(timeRegex);
      if (match) {
        const timeStr = match[1];
        const label = line.replace(timeStr, '').replace(/[-—:]/g, '').trim();
        if (label) detected.push({ time: parseTimestamp(timeStr), label, raw: timeStr });
      }
    });
    return detected.slice(0, 15);
  };

  const searchYouTube = async (query) => {
    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${YOUTUBE_API_KEY}`
      );
      const searchData = await searchRes.json();
      const videoId = searchData.items[0]?.id?.videoId;
      if (!videoId) return null;
      const detailRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
      );
      const detailData = await detailRes.json();
      const description = detailData.items[0]?.snippet?.description || "";
      return { videoId, chapters: extractChapters(description) };
    } catch (error) { 
      console.error("YT Error:", error);
      return null; 
    }
  };

  // Logic extracted into a reusable function
  const performSearch = async (query) => {
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsTyping(true);
    const detectedStartTime = parseTimestamp(query);
    setStartTime(detectedStartTime);
    setActiveVideo(null); 
    setChapters([]);
    setIsVideoLoading(true);
    
    const data = await searchYouTube(query);
    
    setTimeout(() => {
      setIsTyping(false);
      setIsVideoLoading(false);
      if (data) {
        setActiveVideo(data.videoId);
        setChapters(data.chapters);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Visual uplink locked. Found ${data.chapters.length} segments in stream.`,
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Critical Error: Could not establish stable video uplink.",
        }]);
      }
    }, 1500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    performSearch(input);
    setInput("");
  };

  return (
    <div className="h-screen w-full bg-[#020202] text-zinc-400 flex flex-col lg:flex-row overflow-hidden font-mono p-4 gap-4 selection:bg-red-500/30">
      
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
                {isVideoLoading ? "Deep-Scanning Media..." : "Core: Online"}
              </span>
            </div>
            {activeVideo && (
              <div className="flex items-center gap-2 text-red-500 animate-pulse">
                <Activity size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Live Flux: Stable</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden backdrop-blur-sm shadow-2xl flex flex-col">
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {isVideoLoading ? (
                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center bg-black/60 relative z-50">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-32 h-32 border-2 border-red-500/10 border-t-red-500 rounded-full flex items-center justify-center">
                    <Loader2 size={24} className="text-red-500 animate-spin" />
                  </motion.div>
                  <span className="mt-6 text-[10px] font-black tracking-[0.4em] text-red-500 animate-pulse uppercase">Segment Extraction</span>
                </motion.div>
              ) : activeVideo ? (
                <motion.div key="video" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col relative">
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <div className="bg-red-600 px-3 py-1 rounded text-[10px] text-white font-black">
                      {startTime > 0 ? `OFFSET: ${startTime}s` : 'LIVE_FEED'}
                    </div>
                    <button onClick={() => setActiveVideo(null)} className="bg-black/80 hover:bg-red-600 p-1.5 rounded transition-all text-white border border-white/10">
                      <X size={14} />
                    </button>
                  </div>
                  <iframe
                    width="100%" height="100%"
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1&start=${startTime}&modestbranding=1`}
                    frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen
                  />
                </motion.div>
              ) : (
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                    <div className="flex flex-col">
                      <h3 className="text-white text-xs font-black tracking-widest uppercase">System Diagnostics</h3>
                      <p className="text-[9px] text-zinc-600 mt-1 uppercase">Node: RAMCHANDPURA_REDACTED // Status: Ready</p>
                    </div>
                    <Shield size={20} className="text-red-500/20" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                      <HardDrive size={14} className="text-red-500 mb-2" />
                      <div className="text-[10px] font-bold text-zinc-500 uppercase">Buffer Memory</div>
                      <div className="text-lg font-black text-white italic">94.2%</div>
                    </div>
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                      <Globe size={14} className="text-blue-500 mb-2" />
                      <div className="text-[10px] font-bold text-zinc-500 uppercase">Neural Latency</div>
                      <div className="text-lg font-black text-white italic">14ms</div>
                    </div>
                  </div>

                  <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-4 font-mono overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_3px)]" />
                    <div className="flex items-center gap-2 mb-3 text-red-500/50">
                      <Terminal size={12} />
                      <span className="text-[9px] uppercase font-bold tracking-widest">Access Logs</span>
                    </div>
                    <div className="space-y-2 text-[9px] leading-tight text-zinc-500">
                      <p className="flex gap-2"><span className="text-red-900">[OK]</span> Initializing core kernel...</p>
                      <p className="flex gap-2"><span className="text-red-900">[OK]</span> Encrypted tunnel established.</p>
                      <p className="flex gap-2"><span className="text-zinc-700"> [..]</span> Awaiting user input parameters...</p>
                      <p className="flex gap-2 animate-pulse"><span className="text-red-500">&gt;</span> SYSTEM_STANDBY_MODE_ACTIVE</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {chapters.length > 0 && !isVideoLoading && (
              <motion.div initial={{ height: 0 }} animate={{ height: '140px' }} exit={{ height: 0 }} className="border-t border-white/10 bg-black/40 p-4 overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <List size={12} className="text-red-500" />
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-500">Temporal Index Scanned</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {chapters.map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => setStartTime(ch.time)}
                      className="flex-shrink-0 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-red-600/20 hover:border-red-500 transition-all text-left max-w-[160px]"
                    >
                      <div className="text-red-500 text-[9px] font-mono mb-1">{ch.raw}</div>
                      <div className="text-white text-[10px] truncate font-bold">{ch.label}</div>
                    </button>
                  ))}
                </div>
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
              <span className="text-[11px] font-black tracking-[0.2em] text-white uppercase">Neural_Uplink_v3.0</span>
           </div>
           <Hash size={16} className="text-zinc-700" />
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col justify-end pb-12">
              <Sparkles className="text-red-600 mb-4" size={24} />
              <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">Initialized.</h2>
              <p className="text-[11px] text-zinc-600 leading-relaxed max-w-[250px] font-bold uppercase">
                Search for a topic. The system will auto-extract chapters for quick navigation.
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
          {isTyping && <div className="text-[9px] text-red-500 animate-pulse font-black tracking-[0.3em] px-2 italic uppercase text-center">Rerouting Data...</div>}
        </div>

        <div className="p-6 bg-black/40">
          <form onSubmit={handleSend} className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-2xl p-2 pr-3 focus-within:border-red-500/50 transition-all">
            <input 
              type="text"
              placeholder="Query any topic..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[13px] py-3 px-4 text-white placeholder:text-zinc-800 font-mono tracking-tight"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isVideoLoading}
              className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-10"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AskAi;