  import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar'; // Make sure path is correct
import LandingPage from './pages/Landing'; 
import Explore from './pages/Explore';

// ResultsView kept for context - now with adjusted padding for Navbar
const ResultsView = ({ query }) => {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-gray-900 rounded-3xl border border-white/10 overflow-hidden relative">
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-end p-8">
               <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest">Active Search: {query}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold">Neural Results Loaded</h2>
        </div>
      </div>
    </div>
  );
};

// We wrap the content in a sub-component to access useLocation for AnimatePresence
const AnimatedRoutes = ({ activeQuery, setActiveQuery }) => {
  const location = useLocation();
  
  return (
    <>
      <Navbar /> 
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={<LandingPage onSearchStart={(q) => setActiveQuery(q)} />} 
          />
          <Route path="/explore" element={<Explore />} />
          <Route path="/results" element={<ResultsView query={activeQuery} />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  const [activeQuery, setActiveQuery] = useState("");

  return (
    <Router>
      <div className="App bg-[#020202]">
        <AnimatedRoutes activeQuery={activeQuery} setActiveQuery={setActiveQuery} />
      </div>
    </Router>
  );
}

export default App;