import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Target, 
  Sparkles, 
  Youtube, 
  Shield, 
  Mail, 
  Globe, 
  Zap, 
  Cpu,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase'; 
import Navbar from '../components/Navbar';

const LandingPage = ({ onSearchStart }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // --- NEURAL PULSE SOUND SYNTHESIZER ---
  const playPulseSound = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, context.currentTime); // Low bass pulse
    oscillator.frequency.exponentialRampToValueAtTime(40, context.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  };

  // --- TYPING ANIMATION LOGIC ---
  const [placeholder, setPlaceholder] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const phrases = useMemo(() => [
    "Describe a moment you want to find...",
    "Search for the sunset scene in Malibu...",
    "Find where the protagonist says 'Hello'...",
    "Extract all shots of the red car...",
    "Locate the high-speed chase sequence..."
  ], []);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typeSpeed = isDeleting ? 30 : 70;

    const timeout = setTimeout(() => {
      if (!isDeleting && placeholder === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && placeholder === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        const nextChar = isDeleting 
          ? currentPhrase.substring(0, placeholder.length - 1)
          : currentPhrase.substring(0, placeholder.length + 1);
        setPlaceholder(nextChar);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, phraseIndex, phrases]);

  // --- NEURAL STACK STATE ---
  const [cards, setCards] = useState([
    {
      id: 1,
      title: "INNOVATE",
      subtitle: "Build the Future",
      desc: "Access cutting-edge resources and AI frameworks to scale your vision.",
      icon: <Sparkles size={32} className="text-white" />,
      color: "from-red-600 to-orange-500"
    },
    {
      id: 2,
      title: "SYNTHESIZE",
      subtitle: "Neural Logic",
      desc: "Multi-layer processing that understands context, not just keywords.",
      icon: <Cpu size={32} className="text-white" />,
      color: "from-zinc-700 to-zinc-900"
    },
    {
      id: 3,
      title: "EXTRACT",
      subtitle: "Data Mining",
      desc: "Deep-seek algorithms that pull specific moments from hours of footage.",
      icon: <Database size={32} className="text-white" />,
      color: "from-red-900 to-black"
    }
  ]);

  const rotateCards = () => {
    playPulseSound(); // Trigger sound on click
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const firstCard = newCards.shift();
      newCards.push(firstCard);
      return newCards;
    });
  };

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
      navigate('/ask-ai', { state: { initialQuery: query } });
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
                  placeholder={placeholder}
                  onFocus={() => {
                    setIsFocused(true);
                    if (!auth.currentUser) navigate('/login'); 
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

        {/* --- NEURAL STACK SECTION --- */}
        <div className="mt-64 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center px-4 mb-40">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">
              <Zap size={12} fill="currentColor" /> Neural Core Active
            </div>
            <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
              Infinite <br /> <span className="text-red-600">Architecture.</span>
            </h3>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em] leading-loose max-w-md">
              Tap the stack to cycle through our neural processing layers. Every click reveals a deeper level of intelligence.
            </p>
          </div>

          <div className="relative h-[600px] w-full flex items-center justify-center scale-100 md:scale-110">
            <AnimatePresence mode="popLayout">
              {cards.map((card, index) => {
                const isFront = index === 0;
                const isMiddle = index === 1;

                return (
                  <motion.div 
                    key={card.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      x: isFront ? 0 : isMiddle ? 40 : 80, 
                      y: isFront ? 0 : isMiddle ? -50 : -100,
                      scale: isFront ? 1 : isMiddle ? 0.95 : 0.9,
                      rotate: isFront ? -4 : isMiddle ? 2 : 8,
                      zIndex: 30 - index,
                      opacity: isFront ? 1 : isMiddle ? 0.7 : 0.4,
                    }}
                    transition={{ type: "spring", stiffness: 250, damping: 30 }}
                    onClick={rotateCards}
                    className={`absolute w-[380px] h-[380px] rounded-[3.5rem] p-10 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-shadow duration-500
                      ${isFront 
                        ? 'bg-[#0d0d0d] border border-red-500/40 shadow-[0_30px_100px_rgba(220,38,38,0.25)] backdrop-blur-xl' 
                        : 'bg-zinc-900/80 border border-white/5 shadow-2xl'
                      }
                    `}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-t ${card.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
                      {card.icon}
                    </div>
                    <h4 className="text-3xl font-black tracking-[0.2em] uppercase mb-1 italic">{card.title}</h4>
                    <div className="text-[10px] font-bold text-red-500 uppercase tracking-[0.4em] mb-4">{card.subtitle}</div>
                    <p className="text-[11px] text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">
                      {card.desc}
                    </p>
                    
                    {isFront && (
                      <motion.div 
                        animate={{ opacity: [0.3, 1, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="mt-6 text-[8px] font-black text-red-600 tracking-[0.5em]"
                      >
                        CLICK TO CYCLE
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* FEATURES GRID */}
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