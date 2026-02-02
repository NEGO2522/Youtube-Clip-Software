import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './pages/Landing'; // The component we made earlier

// --- Mock Results Component (The "Action" Page) ---
const ResultsView = ({ query }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-[#050505] p-6"
    >
      <header className="flex justify-between items-center mb-12">
        <button onClick={() => navigate('/')} className="text-cyan-400 font-mono text-sm tracking-widest">
          &larr; RETURN_TO_CORE
        </button>
        <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-sm">
          Query: <span className="text-cyan-400">"{query}"</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video Player Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-gray-900 rounded-3xl border border-white/10 overflow-hidden relative group">
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-100 group-hover:opacity-0 transition-opacity">
              <div className="text-center">
                <p className="text-cyan-400 font-mono text-xs mb-2 underline">CLIP DETECTED AT 12:42</p>
                <div className="w-16 h-16 border-2 border-cyan-500 rounded-full flex items-center justify-center">
                   <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-cyan-500 border-b-[10px] border-b-transparent ml-1" />
                </div>
              </div>
            </div>
            {/* Real YouTube Embed would go here with ?start=762 */}
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-end p-8">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]" 
                />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold">The moment of discovery</h2>
          <p className="text-gray-400">Extracted from: <span className="text-white">"History of Innovation" by TechChannel</span></p>
        </div>

        {/* Sidebar: AI Insights */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Neural Breakdown</h3>
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 5 }}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:border-cyan-500/50 transition-colors"
            >
              <p className="text-sm font-medium mb-1">Related Timestamp {i}:00</p>
              <p className="text-xs text-gray-500">AI found a high-probability match for your context here.</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---
function App() {
  const [activeQuery, setActiveQuery] = useState("");

  return (
    <Router>
      <div className="App">
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <LandingPage 
                  onSearchStart={(q) => setActiveQuery(q)} 
                />
              } 
            />
            <Route 
              path="/results" 
              element={<ResultsView query={activeQuery} />} 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;