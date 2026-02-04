import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Globe, Zap, Headset } from 'lucide-react';
import Navbar from '../components/Navbar';

const ContactUs = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for form submission
    console.log("Transmission Sent:", formState);
  };

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white overflow-x-hidden relative font-sans selection:bg-red-600/40">
      <Navbar />

      {/* --- AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-red-600/5 blur-[100px] rounded-full opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto pt-32 pb-24 px-6">
        
        {/* HEADER */}
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6"
          >
            <Zap size={12} fill="currentColor" /> System Communication Link
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.8] mb-6">
            Contact <span className="text-red-600">Us.</span>
          </h1>
          <p className="max-w-xl text-zinc-500 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] leading-loose">
            Initiate a transmission. Our neural support agents typically respond within 24 operational hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT SIDE: INFO CARDS */}
          <div className="space-y-4">
            {[
              { icon: <Mail size={20} />, label: "Email Transmission", value: "support@clupe.ai" },
              { icon: <Headset size={20} />, label: "Support Terminal", value: "Available 24/7" },
              { icon: <Globe size={20} />, label: "Headquarters", value: "Neo-City Hub 01" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-red-600/30 transition-all group"
              >
                <div className="text-red-600 mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{item.label}</div>
                <div className="text-sm font-bold uppercase tracking-wider">{item.value}</div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT SIDE: CONTACT FORM */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 p-8 md:p-12 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">User_ID / Name</label>
                  <input 
                    type="text" 
                    placeholder="ENTER NAME"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 transition-colors font-bold text-sm uppercase tracking-widest"
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Email_Address</label>
                  <input 
                    type="email" 
                    placeholder="ENTER EMAIL"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 transition-colors font-bold text-sm uppercase tracking-widest"
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Message_Payload</label>
                <textarea 
                  rows="4"
                  placeholder="WHAT IS ON YOUR MIND?"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 transition-colors font-bold text-sm uppercase tracking-widest resize-none"
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full group relative py-5 bg-red-600 rounded-xl flex items-center justify-center gap-3 overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
              >
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 font-black uppercase tracking-[0.4em] text-xs text-white group-hover:text-black transition-colors">
                  Transmit Message
                </span>
                <Send size={16} className="relative z-10 text-white group-hover:text-black transition-colors" />
              </button>
            </form>

            {/* Background Icon Accent */}
            <MessageSquare size={200} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12 pointer-events-none" />
          </motion.div>
        </div>
      </main>

      {/* FOOTER ACCENT */}
      <div className="mt-auto h-1 w-full bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
    </div>
  );
};

export default ContactUs;