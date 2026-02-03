import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Target, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Adjust path based on your folder structure

const LandingPage = ({ onSearchStart }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    onSearchStart(query);
    navigate('/results');
  };

  return (
    <div className="h-screen w-full bg-[#020202] text-white overflow-hidden relative flex flex-col items-center justify-center font-sans selection:bg-red-600/40">
      
      <Navbar />

      {/* --- MINIMALIST AMBIENCE --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* --- CENTRAL CONTENT --- */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center px-6 mt-10">
        {/* HERO IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden group shadow-[0_0_100px_-20px_rgba(220,38,38,0.3)] border border-white/10"
        >
          <img
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Cinematic"
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
          <div className="absolute inset-x-0 bottom-12 flex flex-col items-center justify-end">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-4xl font-light tracking-[0.15em] uppercase text-center text-white/90"
            >
              Don't Watch. <span className="font-black italic text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">Extract.</span>
            </motion.h2>
          </div>
        </motion.div>

        {/* SEARCH CONSOLE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-3xl -mt-10 relative z-20"
        >
          <form onSubmit={onSearch} className="relative">
            <div className={`absolute -inset-1 bg-red-600 rounded-[2rem] blur-2xl transition-opacity duration-500 ${isFocused ? 'opacity-40' : 'opacity-0'}`} />
            <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] flex items-center shadow-2xl">
              <div className="p-4 text-red-600">
                <Target size={28} />
              </div>
              <input
                type="text"
                placeholder="Describe a moment you want to find..."
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent p-4 text-lg outline-none placeholder:text-zinc-700 font-bold"
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="bg-red-600 text-white h-[56px] px-8 rounded-[1.5rem] font-black uppercase tracking-tighter flex items-center gap-2 hover:bg-white hover:text-black transition-all">
                Search <ChevronRight size={18} strokeWidth={3} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* --- FOOTER --- */}
      <div className="absolute bottom-10 flex gap-12 text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
        <div className="flex items-center gap-2 italic"><Sparkles size={12} /> AI Driven</div>
        <div className="flex items-center gap-2 italic"><Sparkles size={12} /> Realtime</div>
        <div className="flex items-center gap-2 italic"><Sparkles size={12} /> No Delay</div>
      </div>
    </div>
  );
};

export default LandingPage;