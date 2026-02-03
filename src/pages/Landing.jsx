import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Target, Sparkles, Youtube, Shield, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase'; // Ensure this path is correct
import Navbar from '../components/Navbar';

const LandingPage = ({ onSearchStart }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Redirect logic if not signed in
  const checkAuthAndExecute = (action) => {
    if (!auth.currentUser) {
      navigate('/login');
    } else {
      action();
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    if (!query) return;

    checkAuthAndExecute(() => {
      onSearchStart(query);
      navigate('/results');
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white overflow-y-auto overflow-x-hidden relative font-sans selection:bg-red-600/40">
      <Navbar />

      {/* --- MINIMALIST AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* --- MAIN SECTION --- */}
      <main className="relative z-10 w-full flex flex-col items-center pt-32 pb-20 px-6">
        
        {/* HERO IMAGE */}
        <div className="relative w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden group shadow-[0_0_100px_-20px_rgba(220,38,38,0.3)] border border-white/10"
          >
            <img
              src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
              alt="Hero Cinematic"
              className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
            <div className="absolute inset-x-0 bottom-12 flex flex-col items-center justify-end">
              <motion.h2 className="text-2xl md:text-4xl font-light tracking-[0.15em] uppercase text-center text-white/90">
                Don't Watch. <span className="font-black italic text-red-600">Extract.</span>
              </motion.h2>
            </div>
          </motion.div>

          {/* SEARCH CONSOLE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-3xl mx-auto -mt-10 relative z-20"
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
                  onFocus={() => {
                    setIsFocused(true);
                    if (!auth.currentUser) navigate('/login'); // Intercept on click
                  }}
                  onBlur={() => setIsFocused(false)}
                  className="w-full bg-transparent p-4 text-lg outline-none placeholder:text-zinc-700 font-bold"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="bg-red-600 text-white h-[56px] px-8 rounded-[1.5rem] font-black uppercase tracking-tighter flex items-center gap-2 hover:bg-white hover:text-black transition-all">
                  Search <ChevronRight size={18} strokeWidth={3} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* FEATURES GRID (FOR SCROLLABILITY) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-32 px-4">
          {[
            { icon: <Sparkles size={20} />, title: "AI Precision", desc: "Find exact timestamps instantly." },
            { icon: <Shield size={20} />, title: "Secure Auth", desc: "Passwordless magic link entry." },
            { icon: <Globe size={20} />, title: "Global Sync", desc: "Access your clips anywhere." },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:bg-red-600/5 transition-colors group">
              <div className="text-red-600 mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-black uppercase tracking-widest text-xs mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-xs font-bold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-[#050505] pt-20 pb-10 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Youtube className="text-red-600" fill="currentColor" size={24} />
              <span className="text-xl font-black uppercase tracking-tighter">Clupe</span>
            </div>
            <p className="max-w-xs text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-loose">
              The next generation of video intelligence. Extracting value from chaos.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Legal</h4>
              <button className="text-left text-zinc-400 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors">Privacy_Policy</button>
              <button className="text-left text-zinc-400 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors">Terms_Of_Service</button>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Support</h4>
              <button className="text-left text-zinc-400 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2"><Mail size={10} /> Contact_Us</button>
              <button className="text-left text-zinc-400 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors">Help_Center</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-zinc-700 text-[8px] font-black uppercase tracking-[0.4em]">
            <span className="flex items-center gap-1 italic text-red-600/50"><Sparkles size={8} /> AI Powered</span>
            <span>© 2024 CLUPE_SYSTEMS</span>
          </div>
          <div className="text-zinc-800 font-black text-[8px] uppercase tracking-[0.8em]">
            SYSTEM_STATUS: OPERATIONAL
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;