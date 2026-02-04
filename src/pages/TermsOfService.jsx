import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, Terminal, AlertTriangle, Scale, ShieldAlert, Cpu } from 'lucide-react';
import Navbar from '../components/Navbar';

const TermsOfService = () => {
  const clauses = [
    {
      icon: <Terminal className="text-red-600" size={24} />,
      title: "01. License to Use",
      content: "Clupe grants you a non-exclusive, non-transferable license to access our neural extraction tools. You agree not to reverse-engineer, scrape, or attempt to bypass our system architecture."
    },
    {
      icon: <Cpu className="text-red-600" size={24} />,
      title: "02. AI Processing Limits",
      content: "Users are responsible for the content they process. Clupe is an extraction tool; we do not claim ownership of your videos, but we reserve the right to throttle usage that compromises system stability."
    },
    {
      icon: <ShieldAlert className="text-red-600" size={24} />,
      title: "03. Prohibited Conduct",
      content: "Automated queries (bots) are strictly prohibited without API clearance. Any attempt to exploit the neural core will result in an immediate and permanent account suspension."
    },
    {
      icon: <AlertTriangle className="text-red-600" size={24} />,
      title: "04. Limitation of Liability",
      content: "The Clupe system is provided 'AS IS'. We are not responsible for inaccuracies in AI-generated timestamps or data loss resulting from network instability."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white overflow-x-hidden relative font-sans selection:bg-red-600/40">
      <Navbar />

      {/* --- AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[150px] rounded-full opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto pt-32 pb-24 px-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4">
              <Scale size={14} /> Legal Framework
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.8]">
              Terms of <br /><span className="text-red-600">Service.</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-right hidden md:block"
          >
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest leading-loose">
              Document: TOS_V2<br />
              Status: Binding<br />
              Region: Global_Neural_Net
            </p>
          </motion.div>
        </div>

        {/* CLAUSE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clauses.map((clause, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-zinc-900/20 border border-white/5 rounded-3xl hover:bg-red-600/5 hover:border-red-600/20 transition-all group"
            >
              <div className="mb-6 p-3 w-fit bg-black rounded-xl border border-white/5 group-hover:border-red-600/40 transition-colors">
                {clause.icon}
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest mb-4 italic">
                {clause.title}
              </h2>
              <p className="text-zinc-500 text-xs font-bold leading-relaxed uppercase tracking-widest">
                {clause.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* TERMINATION BLOCK */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 p-1 bg-gradient-to-r from-red-600/50 via-zinc-800 to-transparent rounded-2xl"
        >
          <div className="bg-[#050505] p-8 rounded-[0.9rem]">
            <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.3em] mb-4">
              <Gavel size={18} className="text-red-600" /> Termination Clause
            </h3>
            <p className="text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] leading-loose">
              We reserve the right to terminate access to the Clupe Systems dashboard at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the service, us, or third parties, or for any other reason.
            </p>
          </div>
        </motion.div>

        {/* ACTION FOOTER */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em]">
            By continuing to use Clupe, you accept these protocols.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="group relative px-12 py-4 overflow-hidden rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">I Accept & Return</span>
            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;