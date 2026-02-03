import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar'; 
import LandingPage from './pages/Landing'; 
import Explore from './pages/Explore';
import Login from './components/Login';
import Profile from './components/Profile'; // 1. Import your Profile page

// ResultsView kept for context
const ResultsView = ({ query }) => {
  return (
    <div className="min-h-screen bg-[#050505] pt-32 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-gray-900 rounded-3xl border border-white/10 overflow-hidden relative">
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-end p-8">
               <span className="text-red-600 font-mono text-xs uppercase tracking-widest">Active Search: {query}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tighter">Neural Results Loaded</h2>
        </div>
      </div>
    </div>
  );
};

// Sub-component to handle route transitions and conditional Navbar
const AnimatedRoutes = ({ activeQuery, setActiveQuery }) => {
  const location = useLocation();
  
  // Define auth paths to hide the Navbar
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  return (
    <>
      {/* Navbar will NOT render on Login or Signup pages */}
      {!isAuthPage && <Navbar />} 
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={<LandingPage onSearchStart={(q) => setActiveQuery(q)} />} 
          />
          <Route path="/explore" element={<Explore />} />
          <Route path="/results" element={<ResultsView query={activeQuery} />} />
          
          {/* 2. Added Profile Route */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Added Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          
          {/* Catch-all: Redirects any unknown URL back to Home */}
          <Route path="*" element={<LandingPage onSearchStart={(q) => setActiveQuery(q)} />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  const [activeQuery, setActiveQuery] = useState("");

  return (
    <Router>
      <div className="App bg-[#020202] min-h-screen selection:bg-red-600/30">
        <AnimatedRoutes activeQuery={activeQuery} setActiveQuery={setActiveQuery} />
      </div>
    </Router>
  );
}

export default App;