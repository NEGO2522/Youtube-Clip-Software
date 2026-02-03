import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Flame, Clock, Loader2, Search as SearchIcon } from 'lucide-react';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const Explore = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState(""); // The query actually being fetched

  const observer = useRef();
  const lastVideoElementRef = useCallback(node => {
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextPageToken) {
        fetchVideos(true);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, isFetchingMore, nextPageToken]);

  const fetchVideos = async (isMore = false) => {
    if (isMore) setIsFetchingMore(true);
    else setLoading(true);

    try {
      const pageParam = nextPageToken ? `&pageToken=${nextPageToken}` : "";
      let url = "";

      // Logic: If user searched something, use it. Otherwise, use curated defaults.
      const queryToUse = activeQuery || "English Songs|Amazing Coding Projects|TMKOC best episodes";

      if (!isLoggedIn) {
        url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(queryToUse)}&type=video&videoDuration=medium&relevanceLanguage=en${pageParam}&key=${API_KEY}`;
      } else {
        // If logged in, we use popular videos unless a search is active
        if (activeQuery) {
          url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(activeQuery)}&type=video${pageParam}&key=${API_KEY}`;
        } else {
          url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=12&regionCode=US${pageParam}&key=${API_KEY}`;
        }
      }

      const response = await fetch(url);
      const data = await response.json();

      const videoData = data.items.map(item => ({
        id: item.id.videoId || item.id,
        snippet: item.snippet,
        statistics: item.statistics || { viewCount: "Full Video" }
      }));

      setNextPageToken(data.nextPageToken || null);
      setVideos(prev => isMore ? [...prev, ...videoData] : videoData);
      
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setVideos([]); // Clear current videos
    setNextPageToken(null); // Reset pagination
    setActiveQuery(searchQuery); // Trigger the useEffect
  };

  // Re-fetch when login state or the search query changes
  useEffect(() => {
    fetchVideos();
  }, [isLoggedIn, activeQuery]);

  const formatViews = (views) => {
    if (views === "Full Video") return "HD Video";
    const num = Number(views);
    if (isNaN(num)) return views;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white pt-32 pb-20 px-6 md:px-12 font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full opacity-30" />
      </div>

      {/* Header Section */}
      <div className="relative z-20 max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-600/20 rounded-lg text-red-600">
              <Flame size={20} fill="currentColor" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
              {activeQuery ? `Results for: ${activeQuery}` : (isLoggedIn ? "Personalized" : "Exclusive Feed")}
            </span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black uppercase tracking-tighter whitespace-nowrap">
              {isLoggedIn && !activeQuery ? "Your" : "Curated"} <span className="text-red-600 italic">Experience</span>
            </motion.h1>

            {/* Functional Search Bar */}
            <form onSubmit={handleSearch} className="relative group w-full max-w-md">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-red-600/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600"
              />
            </form>
          </div>
        </div>

        <button onClick={() => { setIsLoggedIn(!isLoggedIn); setActiveQuery(""); setSearchQuery(""); }} className="text-[8px] border border-white/10 px-4 py-2 rounded-full text-zinc-500 hover:text-white transition-all hover:bg-white/5 h-fit">
          {isLoggedIn ? "LOGOUT" : "LOGIN TO PERSONALIZE"}
        </button>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 relative z-10">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-zinc-900 rounded-[2rem] mb-4" />
              <div className="h-4 bg-zinc-900 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-900 rounded w-1/2" />
            </div>
          ))
        ) : (
          videos.map((video, index) => {
            const isLastElement = videos.length === index + 1;
            return (
              <motion.div
                key={`${video.id}-${index}`}
                ref={isLastElement ? lastVideoElementRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 4) * 0.05 }}
                className="group cursor-pointer"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
              >
                <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 mb-5 shadow-lg group-hover:shadow-red-600/20 transition-all duration-500">
                  <img 
                    src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url} 
                    alt={video.snippet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="p-4 bg-red-600 rounded-full shadow-2xl">
                      <Play size={24} fill="white" className="ml-1" />
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-red-500 transition-colors leading-snug">
                    {video.snippet.title}
                  </h3>
                  <div className="flex items-center justify-between text-[9px] text-zinc-500 font-black uppercase tracking-[0.15em]">
                    <span className="truncate max-w-[140px]">{video.snippet.channelTitle}</span>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Clock size={10} className="text-red-600" />
                      <span>{formatViews(video.statistics.viewCount)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {isFetchingMore && (
        <div className="w-full flex justify-center mt-12 py-10">
          <Loader2 className="animate-spin text-red-600" size={32} />
        </div>
      )}
    </div>
  );
};

export default Explore;