import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Youtube, 
  Compass, 
  Clapperboard, 
  Bot, 
  Library, 
  UserCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Search', icon: <Search size={16} />, path: '/' },
    { name: 'Explore', icon: <Compass size={16} />, path: '/explore' },
    { name: 'Clips', icon: <Clapperboard size={16} />, path: '#' },
    { name: 'Ask AI', icon: <Bot size={16} />, path: '#' },
    { name: 'Library', icon: <Library size={16} />, path: '#' },
    { name: 'Profile', icon: <UserCircle size={16} />, path: '#' },
  ];

  return (
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

      {/* Navigation Items */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <button 
            key={item.name}
            onClick={() => item.path !== '#' && navigate(item.path)}
            // Added cursor-pointer here to ensure the entire button area triggers the hand icon
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-600 transition-colors group cursor-pointer"
          >
            <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </div>

      {/* Right Side Status Indicator */}
      <div className="w-24 flex justify-end cursor-pointer">
           <div className="h-1 w-1 bg-red-600 rounded-full animate-pulse" />
      </div>
    </motion.nav>
  );
};

export default Navbar;