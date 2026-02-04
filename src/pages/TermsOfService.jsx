import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Gavel, UserCheck, ShieldAlert } from 'lucide-react';
import Navbar from '../components/Navbar';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <UserCheck className="text-red-600" size={22} />,
      title: "User Agreement",
      content: "By accessing Clupe, you agree to represent yourself accurately. Any attempt to bypass neural extraction filters or reverse-engineer the AI architecture is strictly prohibited."
    },
    {
      icon: <Gavel className="text-red-600" size={22} />,
      title: "Usage Rights",
      content: "The system is provided for metadata extraction and analysis. Users retain rights to their search queries, while Clupe retains ownership of the underlying processing algorithms."
    },
    {
      icon: <ShieldAlert className="text-red-600" size={22} />,
      title: "Prohibited Acts",
      content: "You may not use Clupe to process content that violates international copyright laws or generate deep-fake metadata intended to deceive or harm others."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white relative font-sans selection:bg-red-600/40">
      <Navbar />

      {/* --- AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-red-600/5 blur-[100px] rounded-full opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:35px_35px]" />
      </div>

      <main className="relative z-10 w-full max-w-5xl pt-28 pb-20 px-6 mx-auto">
        
        {/* HEADER - LEFT ALIGNED */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full text-left mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-4">
            <FileText size={10} fill="currentColor" /> Protocol: Standard
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight italic leading-none mb-4">
            Terms of <span className="text-red-600">Service.</span>
          </h1>
          
          <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.3em]">
            Last Updated: February 2026 // v1.8.0
          </p>
        </motion.div>

        {/* CONTENT SECTION */}
        <div className="flex flex-col gap-5 w-full">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group w-full p-6 md:p-8 bg-zinc-900/20 backdrop-blur-xl border border-white/5 rounded-[2rem] hover:border-red-600/30 transition-all duration-300"
            >
              <div className="flex flex-row items-start gap-6 md:gap-10">
                
                {/* ICON */}
                <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-black rounded-xl border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {section.icon}
                </div>

                {/* TEXT CONTENT */}
                <div className="flex-1 text-left pt-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-wider italic leading-none">
                      {section.title}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-red-600/30 to-transparent hidden md:block" />
                  </div>
                  
                  <p className="text-zinc-400 text-xs md:text-sm font-medium leading-relaxed tracking-wide opacity-90">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* COMPLIANCE BOX */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 p-8 border-l-2 border-red-600 bg-white/5 rounded-r-[2rem] w-full text-left"
        >
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-red-600">Compliance & Governance</h3>
          <p className="text-zinc-500 text-[11px] font-medium tracking-wide leading-relaxed">
            These terms constitute a legal agreement between the user and Clupe. Failure to comply with the usage guidelines may result in immediate termination of access. We reserve the right to update these protocols to reflect neural infrastructure changes.
          </p>
        </motion.div>

        {/* RETURN BUTTON */}
        <div className="mt-16 flex justify-start w-full">
          <button 
            onClick={() => window.history.back()}
            className="group relative px-10 py-3.5 bg-transparent overflow-hidden rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:border-red-600 cursor-pointer"
          >
            <span className="relative z-10 transition-colors group-hover:text-white">Return to Terminal</span>
            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </main>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-red-600/30 to-transparent opacity-20 mt-10" />
    </div>
  );
};

export default TermsOfService;