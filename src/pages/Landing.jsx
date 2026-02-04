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
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(150, context.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(40, context.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.1);
    } catch (e) {
      console.log("Audio preview blocked by browser policy");
    }
  };

  // --- TYPING ANIMATION LOGIC ---
  const [placeholder, setPlaceholder] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const phrases = useMemo(() => [
    "Describe a moment...",
    "Search the sunset scene...",
    "Find 'Hello' scene...",
    "Extract red car shots...",
    "Locate the chase..."
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
    playPulseSound();
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

      {/* --- AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-red-600/10 blur-[80px] md:blur-[120px] rounded-full opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:50px_50px]" />
      </div>

      <main className="relative z-10 w-full flex flex-col items-center pt-24 md:pt-32 pb-20 px-4 md:px-6">
        
        {/* HERO IMAGE */}
        <div className="relative w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-[4/3] md:aspect-video rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden group shadow-[0_0_50px_-20px_rgba(220,38,38,0.3)] border border-white/10"
          >
            <img
              src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
              alt="Hero Cinematic"
              className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
            <div className="absolute inset-x-0 bottom-6 md:bottom-12 flex flex-col items-center justify-end px-4">
              <motion.h2 className="text-xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.15em] uppercase text-center text-white/90">
                Don't Watch. <span className="font-black italic text-red-600">Extract.</span>
              </motion.h2>
            </div>
          </motion.div>

          {/* SEARCH CONSOLE - Adjusted mt-6 for mobile to prevent image overlap */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-3xl mx-auto mt-6 md:-mt-10 relative z-20 px-2"
          >
            <form onSubmit={onSearch} className="relative">
              <div className={`absolute -inset-1 bg-red-600 rounded-[1.5rem] md:rounded-[2rem] blur-xl transition-opacity duration-500 ${isFocused ? 'opacity-40' : 'opacity-0'}`} />
              <div className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-1.5 md:p-2 rounded-[1.5rem] md:rounded-[2rem] flex flex-col md:flex-row items-stretch md:items-center shadow-2xl">
                <div className="flex items-center flex-1">
                  <div className="pl-4 pr-2 text-red-600">
                    <Target size={24} />
                  </div>
                  <input
                    type="text"
                    placeholder={placeholder}
                    onFocus={() => {
                      setIsFocused(true);
                      if (!auth.currentUser) navigate('/login'); 
                    }}
                    onBlur={() => setIsFocused(false)}
                    className="w-full bg-transparent py-4 md:p-4 text-base md:text-lg outline-none placeholder:text-zinc-700 font-bold"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="bg-red-600 text-white h-[50px] md:h-[56px] px-6 md:px-8 rounded-[1rem] md:rounded-[1.5rem] font-black uppercase tracking-tighter flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all mb-1 md:mb-0 mx-1 md:mx-0">
                  Search <ChevronRight size={18} strokeWidth={3} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* --- NEURAL STACK SECTION --- */}
        <div className="mt-24 md:mt-64 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center px-4 mb-20 md:mb-40">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">
              <Zap size={12} fill="currentColor" /> Neural Core Active
            </div>
            <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.9] md:leading-none">
              Infinite <br /> <span className="text-red-600">Architecture.</span>
            </h3>
            <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em] leading-loose max-w-md mx-auto lg:mx-0">
              Tap the stack to cycle through our neural processing layers. Every click reveals a deeper level of intelligence.
            </p>
          </div>

          <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center scale-90 md:scale-110">
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
                      x: isFront ? 0 : isMiddle ? 30 : 60, 
                      y: isFront ? 0 : isMiddle ? -30 : -60,
                      scale: isFront ? 1 : isMiddle ? 0.95 : 0.9,
                      rotate: isFront ? -4 : isMiddle ? 2 : 8,
                      zIndex: 30 - index,
                      opacity: isFront ? 1 : isMiddle ? 0.7 : 0.4,
                    }}
                    transition={{ type: "spring", stiffness: 250, damping: 30 }}
                    onClick={rotateCards}
                    className={`absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-shadow duration-500
                      ${isFront 
                        ? 'bg-[#0d0d0d] border border-red-500/40 shadow-[0_30px_100px_rgba(220,38,38,0.25)] backdrop-blur-xl' 
                        : 'bg-zinc-900/80 border border-white/5 shadow-2xl'
                      }
                    `}
                  >
                    <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-t ${card.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-xl`}>
                      {React.cloneElement(card.icon, { size: window.innerWidth < 768 ? 24 : 32 })}
                    </div>
                    <h4 className="text-xl md:text-3xl font-black tracking-[0.2em] uppercase mb-1 italic">{card.title}</h4>
                    <div className="text-[8px] md:text-[10px] font-bold text-red-500 uppercase tracking-[0.4em] mb-3 md:mb-4">{card.subtitle}</div>
                    <p className="text-[9px] md:text-[11px] text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">
                      {card.desc}
                    </p>
                    
                    {isFront && (
                      <motion.div 
                        animate={{ opacity: [0.3, 1, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="mt-4 md:mt-6 text-[7px] md:text-[8px] font-black text-red-600 tracking-[0.5em]"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl px-4">
          {[
            { icon: <Sparkles size={20} />, title: "AI Precision", desc: "Find exact timestamps instantly." },
            { icon: <Shield size={20} />, title: "Secure Auth", desc: "Passwordless magic link entry." },
            { icon: <Globe size={20} />, title: "Global Sync", desc: "Access your clips anywhere." },
          ].map((item, i) => (
            <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/5 rounded-2xl md:rounded-3xl hover:bg-red-600/5 transition-colors group">
              <div className="text-red-600 mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-black uppercase tracking-widest text-[10px] md:text-xs mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-[10px] md:text-xs font-bold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-[#050505] pt-16 md:pt-20 pb-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-12">
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Youtube className="text-red-600" fill="currentColor" size={24} />
              <span className="text-xl font-black uppercase tracking-tighter">Clupe</span>
            </div>
            <p className="max-w-xs mx-auto md:mx-0 text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-loose">
              The next generation of video intelligence. Extracting value from chaos.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
            <div className="flex flex-col gap-4">
              <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Legal</h4>
              <button className="text-zinc-400 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors">Privacy_Policy</button>
              <button className="text-zinc-400 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors">Terms_Of_Service</button>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Support</h4>
              <button className="text-zinc-400 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center md:justify-start gap-2"><Mail size={10} /> Contact_Us</button>
              <button className="text-zinc-400 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors">Help_Center</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 md:mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-zinc-700 text-[8px] font-black uppercase tracking-[0.4em]">
            <span className="flex items-center gap-1 italic text-red-600/50"><Sparkles size={8} /> AI Powered</span>
            <span>© 2024 CLUPE_SYSTEMS</span>
          </div>
          <div className="text-zinc-800 font-black text-[8px] uppercase tracking-[0.8em] text-center">
            SYSTEM_STATUS: OPERATIONAL
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;