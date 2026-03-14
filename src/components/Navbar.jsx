import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Youtube, 
  Compass, 
  Bot, 
  UserCircle,
  Home,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth"; 
import { auth } from "../firebase/firebase"; 

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { name: 'Home', icon: <Home size={16} />, path: '/' },
    { name: 'Explore', icon: <Compass size={16} />, path: '/explore' },
    { name: 'Ask AI', icon: <Bot size={16} />, path: '/ask-ai' },
  ];

  return (
    <>
      {/* --- MINIMAL NAVBAR --- */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 flex items-center justify-between px-10 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm"
      >
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <Youtube className="text-red-600" size={24} fill="currentColor" />
          <span className="text-sm font-black uppercase tracking-[0.3em] text-white">Clupe</span>
        </div>

        {/* Status Indicator & Profile */}
        <div className="flex items-center gap-4">
          <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${user ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-600'}`} />
          
          <button 
            onClick={() => user ? navigate('/profile') : navigate('/login')}
            className={`p-2 rounded-xl border transition-all ${
              user ? 'bg-zinc-900 border-white/10 text-white hover:border-red-500/50' : 'bg-red-600/10 border-red-600/50 text-red-600 hover:bg-red-600/20'
            }`}
          >
            {user ? <User size={18} /> : <UserCircle size={18} />}
          </button>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;