import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Component Imports
import Navbar from './components/Navbar'; 
import Login from './components/Login';
import Profile from './components/Profile';

// Page Imports
import LandingPage from './pages/Landing'; 
import Explore from './pages/Explore';
import AskAi from './pages/AskAI';
import PrivacyPolicy from './pages/PrivacyPolicy'; 
import TermsOfService from './pages/TermsOfService'; 
import ContactUs from './pages/ContactUs'; 

// --- SCROLL TO TOP LOGIC ---
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This snaps the window to the top (0,0) instantly on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

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
          
          {/* Ask AI Route */}
          <Route path="/ask-ai" element={<AskAi />} />
          
          {/* Profile Route */}
          <Route path="/profile" element={<Profile />} />

          {/* Legal & Support Routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactUs />} />
          
          {/* Auth Routes */}
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
      {/* ScrollToTop component ensures we start at the top of every new page */}
      <ScrollToTop />
      <div className="App bg-[#020202] min-h-screen selection:bg-red-600/30">
        <AnimatedRoutes activeQuery={activeQuery} setActiveQuery={setActiveQuery} />
      </div>
    </Router>
  );
}

export default App;