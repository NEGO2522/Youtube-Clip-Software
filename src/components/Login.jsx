import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log("Logging in with:", email);
    navigate('/'); // Redirect to home after login
  };

  return (
    <div className="h-screen w-full bg-[#020202] text-white flex items-center justify-center font-sans selection:bg-red-600/40 relative overflow-hidden">
      
      {/* --- AMBIENCE --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* --- LOGIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-10 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-red-600/10 rounded-2xl mb-4">
            <Youtube className="text-red-600" size={32} fill="currentColor" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-[0.2em]">Welcome Back</h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-2">Access your extraction console</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="EMAIL_ADDRESS"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-600/50 transition-all font-bold text-xs tracking-widest placeholder:text-zinc-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="ACCESS_KEY"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-600/50 transition-all font-bold text-xs tracking-widest placeholder:text-zinc-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-white hover:text-black text-white font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.2em] group"
          >
            Authorize <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-10 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">or continue with</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 gap-3">
             <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest">
               <Github size={16} /> GitHub
             </button>
          </div>

          <p className="text-center text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-4">
            New to the system? <button onClick={() => navigate('/signup')} className="text-red-600 hover:underline">Register_Device</button>
          </p>
        </div>
      </motion.div>

      {/* Floating Design Elements */}
      <div className="absolute bottom-10 left-10 text-zinc-800 font-black text-[8px] uppercase tracking-[1em] rotate-90 origin-left">
        Clupe_Authorization_Protocol_v1.0
      </div>
    </div>
  );
};

export default Login;