import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  Youtube, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { auth } from '../firebase/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login'); // Protection: kick out if not logged in
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error("Logout Failed", err);
    }
  };

  if (loading) return null; // Or a loading spinner

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white font-sans selection:bg-red-600/40 relative overflow-x-hidden">
      <Navbar />

      {/* --- AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full opacity-30" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full opacity-30" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto pt-32 pb-20 px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center border border-white/10 shadow-[0_0_50px_-10px_rgba(220,38,38,0.5)]"
          >
            <User size={60} strokeWidth={1.5} />
          </motion.div>

          <div className="text-center md:text-left flex-1">
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl font-black uppercase tracking-tighter mb-2"
            >
              {user?.displayName || user?.email?.split('@')[0] || 'Unknown_Entity'}
            </motion.h1>
            <div className="flex items-center justify-center md:justify-start gap-4 text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-red-600" /> Verified_Operator</span>
              <span className="flex items-center gap-1"><Clock size={12} className="text-red-600" /> Since_2025</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group"
          >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> Terminate_Session
          </motion.button>
        </div>

        {/* --- INFORMATION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* USER DETAILS CARD */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] backdrop-blur-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-8 flex items-center gap-2">
                <Settings size={14} /> Core_Credentials
              </h3>
              
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Email_Address</span>
                  <span className="text-xs font-bold text-white/80">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Access_Level</span>
                  <span className="text-[10px] font-black uppercase bg-red-600 px-3 py-1 rounded-full">Administrator</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Auth_Provider</span>
                  <span className="text-xs font-bold flex items-center gap-2">
                    {user?.providerData[0]?.providerId === 'google.com' ? 'Google_OIDC' : 'Passwordless_Link'}
                  </span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 gap-4">
              <button className="p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:border-red-600/50 transition-all flex flex-col items-center gap-3 group">
                <Youtube className="text-zinc-600 group-hover:text-red-600 transition-colors" />
                <span className="text-[8px] font-black uppercase tracking-widest">My_Clips</span>
              </button>
              <button className="p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:border-red-600/50 transition-all flex flex-col items-center gap-3 group">
                <Mail className="text-zinc-600 group-hover:text-red-600 transition-colors" />
                <span className="text-[8px] font-black uppercase tracking-widest">Notifications</span>
              </button>
            </div>
          </div>

          {/* SIDEBAR STATISTICS */}
          <div className="space-y-6">
            <div className="p-8 bg-red-600/5 border border-red-600/20 rounded-[2rem] relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total_Searches</h4>
                <div className="text-4xl font-black italic">142</div>
                <div className="mt-4 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      className="h-full bg-red-600"
                    />
                </div>
                <p className="text-[8px] text-zinc-600 mt-2 font-bold uppercase tracking-widest">65% of monthly quota used</p>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Youtube size={80} />
              </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center">
                <span className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-700 mb-4">Clupe_Auth_v2.1</span>
                <p className="text-[9px] text-zinc-500 font-bold uppercase leading-relaxed">
                  Your data is encrypted using end-to-end industry standards.
                </p>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER STRIP */}
      <div className="absolute bottom-10 left-10 text-zinc-800 font-black text-[8px] uppercase tracking-[1em] rotate-90 origin-left">
        Clupe_Profile_v1.0
      </div>
    </div>
  );
};

export default Profile;