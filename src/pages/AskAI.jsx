import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MessageSquare, 
  Plus, 
  History, 
  Bot, 
  User, 
  Trash2,
  Sparkles
} from 'lucide-react';

const AskAi = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "How to learn React?", date: "2 mins ago" },
    { id: 2, title: "Explain Quantum Physics", date: "1 hour ago" },
  ]);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your Clupe AI assistant. How can I help you today?" }
  ]);
  
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    
    // Add to history sidebar if it's the first message
    if (messages.length === 1) {
      setChatHistory([{ id: Date.now(), title: input.substring(0, 30) + "...", date: "Just now" }, ...chatHistory]);
    }

    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "This is a simulated AI response. Integrate your Gemini or OpenAI API here to get real answers!" 
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full bg-[#020202] text-white pt-20 overflow-hidden">
      
      {/* --- SIDEBAR: HISTORY (Hidden on mobile) --- */}
      <aside className="hidden md:flex flex-col w-72 border-r border-white/5 bg-zinc-900/20 backdrop-blur-md">
        <div className="p-4">
          <button 
            onClick={() => setMessages([{ role: 'assistant', content: "How can I help you?" }])}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/10 border border-red-600/20 rounded-xl text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all group"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-2">
          <div className="flex items-center gap-2 px-2 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <History size={12} />
            Recent Activity
          </div>
          
          {chatHistory.map((chat) => (
            <div 
              key={chat.id}
              className="group flex flex-col gap-1 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
            >
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white truncate">
                {chat.title}
              </span>
              <span className="text-[10px] text-zinc-600">{chat.date}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col relative">
        {/* Abstract Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Messages Display */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 relative z-10 scrollbar-hide"
        >
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-zinc-800' : 'bg-red-600'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-zinc-900 border border-white/5 text-zinc-200' 
                    : 'bg-transparent text-zinc-300'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- INPUT PANEL --- */}
        <div className="p-6 md:p-10 bg-gradient-to-t from-[#020202] via-[#020202] to-transparent relative z-20">
          <form 
            onSubmit={handleSend}
            className="max-w-3xl mx-auto relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-zinc-800 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            
            <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl p-2 pl-6">
              <input 
                type="text"
                placeholder="Ask Clupe AI anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm py-3 placeholder:text-zinc-600"
              />
              <button 
                type="submit"
                className="p-3 bg-red-600 hover:bg-white hover:text-black rounded-xl transition-all shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
            
            <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-widest">
              AI may generate inaccurate info. Powered by Clupe Intelligence.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AskAi;