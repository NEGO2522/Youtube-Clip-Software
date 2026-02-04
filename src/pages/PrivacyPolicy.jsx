import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText, Globe, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <Eye className="text-red-600" size={24} />,
      title: "Data Collection",
      content: "We collect neural metadata and search queries to optimize extraction algorithms. This includes your email for authentication via Firebase and interaction logs within the Clupe environment."
    },
    {
      icon: <Lock className="text-red-600" size={24} />,
      title: "Encryption Protocol",
      content: "All data transmitted is protected by AES-256 encryption. Your authentication is handled via secure magic links, ensuring no passwords are ever stored on our local architecture."
    },
    {
      icon: <Zap className="text-red-600" size={24} />,
      title: "AI Processing",
      content: "Clupe utilizes AI models to process video data. These models analyze content at a frame level but do not 'learn' or store private video assets beyond the session extraction period."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white overflow-x-hidden relative font-sans selection:bg-red-600/40">
      <Navbar />

      {/* --- AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-600/5 blur-[120px] rounded-full opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto pt-32 pb-24 px-6">
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <ShieldCheck size={12} fill="currentColor" /> Security Level: High
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-4">
            Privacy <span className="text-red-600">Policy.</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">
            Effective Date: February 2026 // Version 2.0.4
          </p>
        </motion.div>

        {/* CONTENT GRID */}
        <div className="grid gap-6">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] hover:border-red-600/30 transition-all"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0 p-4 bg-black rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-widest mb-3 italic flex items-center gap-3">
                    {section.title}
                    <div className="h-px flex-1 bg-gradient-to-r from-red-600/50 to-transparent hidden md:block" />
                  </h2>
                  <p className="text-zinc-400 text-sm font-medium leading-relaxed uppercase tracking-wider">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DETAILED TEXT AREA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 p-8 border-l-2 border-red-600 bg-white/5 rounded-r-[2rem]"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-red-600">Infrastructure & Cookies</h3>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-loose">
            Clupe uses essential cookies to maintain user sessions. By using our system, you acknowledge that our neural extraction layers process data to provide specific timestamps. We do not sell user data to third-party entities. All logs are periodically purged to maintain system hygiene.
          </p>
        </motion.div>

        <div className="mt-20 text-center">
          <button 
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
          >
            Return to Terminal
          </button>
        </div>
      </main>

      {/* FOOTER ACCENT */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
    </div>
  );
};

export default PrivacyPolicy;