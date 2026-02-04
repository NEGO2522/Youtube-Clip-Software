import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Globe, Zap, Headset } from 'lucide-react';
import Navbar from '../components/Navbar';

const ContactUs = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Transmission Sent:", formState);
  };

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white relative font-sans selection:bg-red-600/40">
      <Navbar />

      {/* --- AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-red-600/5 blur-[100px] rounded-full opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:35px_35px]" />
      </div>

      <main className="relative z-10 w-full max-w-6xl pt-28 pb-20 px-6 mx-auto">
        
        {/* HEADER - SHIFTED LEFT & DECREASED SIZE */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full text-left mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-4">
            <Zap size={10} fill="currentColor" /> System Communication Link
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight italic leading-none mb-4">
            Contact <span className="text-red-600">Us.</span>
          </h1>
          
          <p className="max-w-xl text-zinc-600 text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed">
            Initiate a transmission. Our neural support agents typically respond within 24 operational hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: INFO CARDS - Side-by-Side Icon layout */}
          <div className="space-y-4">
            {[
              { icon: <Mail size={18} />, label: "Email Transmission", value: "support@clupe.ai" },
              { icon: <Headset size={18} />, label: "Support Terminal", value: "Available 24/7" },
              { icon: <Globe size={18} />, label: "Headquarters", value: "Jaipur City, Rajasthan" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-5 bg-zinc-900/20 backdrop-blur-xl border border-white/5 rounded-2xl hover:border-red-600/30 transition-all group flex items-center gap-5"
              >
                <div className="shrink-0 w-10 h-10 bg-black rounded-lg border border-white/5 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="text-left">
                  <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">{item.label}</div>
                  <div className="text-xs font-bold uppercase tracking-wider">{item.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT SIDE: CONTACT FORM - Decreased input sizes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 p-8 md:p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600 ml-1">User_ID / Name</label>
                  <input 
                    type="text" 
                    placeholder="ENTER NAME"
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 outline-none focus:border-red-600/50 transition-colors font-bold text-xs uppercase tracking-widest text-white placeholder:text-zinc-700"
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600 ml-1">Email_Address</label>
                  <input 
                    type="email" 
                    placeholder="ENTER EMAIL"
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 outline-none focus:border-red-600/50 transition-colors font-bold text-xs uppercase tracking-widest text-white placeholder:text-zinc-700"
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600 ml-1">Message_Payload</label>
                <textarea 
                  rows="4"
                  placeholder="WHAT IS ON YOUR MIND?"
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 outline-none focus:border-red-600/50 transition-colors font-bold text-xs uppercase tracking-widest text-white placeholder:text-zinc-700 resize-none"
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full group relative py-4 bg-red-600 rounded-xl flex items-center justify-center gap-3 overflow-hidden transition-all hover:shadow-[0_0_25px_rgba(220,38,38,0.3)] cursor-pointer"
              >
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 font-black uppercase tracking-[0.3em] text-[10px] text-white group-hover:text-black transition-colors">
                  Transmit Message
                </span>
                <Send size={14} className="relative z-10 text-white group-hover:text-black transition-colors" />
              </button>
            </form>

            {/* Background Icon Accent */}
            <MessageSquare size={180} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12 pointer-events-none" />
          </motion.div>
        </div>
      </main>

      {/* FOOTER ACCENT */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-red-600/30 to-transparent opacity-20 mt-10" />
    </div>
  );
};

export default ContactUs;