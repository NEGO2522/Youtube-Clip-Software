import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Youtube, 
  Compass, 
  Bot, 
  UserCircle,
  Home // Added Home icon
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

  // Added Home to the navigation items
  const navItems = [
    { name: 'Home', icon: <Home size={16} />, path: '/' },
    { name: 'Explore', icon: <Compass size={16} />, path: '/explore' },
    { name: 'Ask AI', icon: <Bot size={16} />, path: '/ask-ai' },
  ];

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 flex items-center justify-between px-10 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm"
      >
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <Youtube className="text-red-600" size={24} fill="currentColor" />
          <span className="text-sm font-black uppercase tracking-[0.3em] text-white">Clupe</span>
        </div>

        {/* Navigation Items (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button 
              key={item.name}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-600 transition-colors group cursor-pointer"
            >
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              {item.name}
            </button>
          ))}

          {user ? (
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-600 transition-colors group cursor-pointer"
            >
              <span className="group-hover:scale-110 transition-transform text-zinc-500 group-hover:text-red-600">
                <UserCircle size={18} />
              </span>
              <span className="max-w-[100px] truncate">
                {user.displayName || user.email?.split('@')[0] || 'User'}
              </span>
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              Join Now
            </button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="w-24 flex justify-end">
             <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${user ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-600'}`} />
        </div>
      </motion.nav>

      {/* --- MOBILE BOTTOM NAVBAR --- */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-black/90 backdrop-blur-xl border-t border-white/5 px-4 py-3 flex items-center justify-around"
      >
        {navItems.map((item) => (
          <button 
            key={item.name}
            onClick={() => item.path !== '#' && navigate(item.path)}
            className="flex flex-col items-center gap-1 text-[8px] font-black uppercase tracking-[0.1em] text-zinc-400 hover:text-red-600 transition-colors"
          >
            {React.cloneElement(item.icon, { size: 20 })}
            <span>{item.name}</span>
          </button>
        ))}
        
        {user ? (
          <button 
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-1 text-[8px] font-black uppercase tracking-[0.1em] text-zinc-400"
          >
            <UserCircle size={20} />
            <span>Profile</span>
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="flex flex-col items-center gap-1 text-[8px] font-black uppercase tracking-[0.1em] text-red-600"
          >
            <UserCircle size={20} />
            <span>Login</span>
          </button>
        )}
      </motion.div>
    </>
  );
};

export default Navbar;