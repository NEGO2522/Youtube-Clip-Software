import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Flame, Clock, MessageSquare, Heart } from 'lucide-react';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const Explore = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        let url = "";

        if (!isLoggedIn) {
          // 1. Added videoDuration='medium' to filter out Shorts (< 1 min)
          // 2. Added relevanceLanguage='en' to keep results consistent
          const searchQuery = "English Songs|Amazing Coding Projects|TMKOC best episodes";
          url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchQuery)}&type=video&videoDuration=medium&relevanceLanguage=en&key=${API_KEY}`;
        } else {
          url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=20&regionCode=US&key=${API_KEY}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // If we are using the 'search' endpoint, statistics aren't included by default.
        // To show view counts for the search results, we'd need a second API call,
        // so for 'Guest' mode, we'll gracefully handle the 'Hidden' state.
        const videoData = data.items.map(item => ({
          id: item.id.videoId || item.id,
          snippet: item.snippet,
          statistics: item.statistics || { viewCount: "Full Video", likeCount: "0", commentCount: "0" }
        }));

        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [isLoggedIn]);

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

      <div className="relative z-10 max-w-7xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-2 bg-red-600/20 rounded-lg text-red-600">
              <Flame size={20} fill="currentColor" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
              {isLoggedIn ? "Personalized" : "Exclusive Feed (No Shorts)"}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
          >
            {isLoggedIn ? "Your" : "Curated"} <span className="text-red-600 italic">Experience</span>
          </motion.h1>
        </div>

        <button 
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="text-[8px] border border-white/10 px-4 py-2 rounded-full text-zinc-500 hover:text-white transition-all hover:bg-white/5"
        >
          {isLoggedIn ? "LOGOUT" : "LOGIN TO PERSONALIZE"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 relative z-10">
        {loading ? (
          [...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-zinc-900 rounded-3xl mb-4" />
              <div className="h-4 bg-zinc-900 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-900 rounded w-1/2" />
            </div>
          ))
        ) : (
          videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
            >
              <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 mb-5 shadow-lg group-hover:shadow-red-600/10 transition-all duration-500">
                <img 
                  src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url} 
                  alt={video.snippet.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="p-4 bg-red-600 rounded-full scale-75 group-hover:scale-100 transition-transform shadow-xl">
                    <Play size={24} fill="white" className="ml-1" />
                  </div>
                </div>
              </div>

              <div className="px-2">
                <h3 className="font-bold text-sm line-clamp-2 leading-snug mb-2 group-hover:text-red-500 transition-colors">
                  {video.snippet.title}
                </h3>
                <div className="flex items-center justify-between text-[9px] text-zinc-500 font-black uppercase tracking-[0.15em]">
                  <span className="truncate max-w-[150px]">{video.snippet.channelTitle}</span>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Clock size={10} className="text-red-600" />
                    <span>{formatViews(video.statistics.viewCount)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;