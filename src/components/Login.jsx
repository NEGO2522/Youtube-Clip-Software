import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Mail, ArrowRight, Chrome } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { 
  sendSignInLinkToEmail, // Updated for Passwordless
  signInWithPopup 
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [linkSent, setLinkSent] = useState(false); // To show success state

  // Email Link (Passwordless) Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain must be whitelisted in the Firebase Console.
      url: 'http://localhost:5173/finish-login', 
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save the email locally so the user doesn't have to type it again on the same device
      window.localStorage.setItem('emailForSignIn', email);
      setLinkSent(true);
    } catch (err) {
      setError("AUTH_ERROR: " + err.message.split('/')[1]?.replace(')', '') || err.message);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError("GOOGLE_AUTH_FAILED");
    }
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
        className="relative z-10 w-full max-w-md p-10 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-red-600/10 rounded-2xl mb-4">
            <Youtube className="text-red-600" size={32} fill="currentColor" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-[0.2em]">Clupe Login</h2>
          
          {error && (
            <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-4 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}

          {linkSent && (
            <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest mt-4 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
              Check your email for the access link!
            </p>
          )}
        </div>

        {!linkSent ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="EMAIL_ADDRESS"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-600/50 transition-all font-bold text-xs tracking-widest"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-white hover:text-black text-white font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.2em] group"
            >
              Send Magic Link <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <button 
              onClick={() => setLinkSent(false)} 
              className="text-[9px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold"
            >
              ← Use a different email
            </button>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">or</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <Chrome size={16} className="text-red-600" /> Continue with Google
          </button>

          
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-10 text-zinc-800 font-black text-[8px] uppercase tracking-[1em] rotate-90 origin-left">
        Clupe_Auth_v2.1
      </div>
    </div>
  );
};

export default Login;