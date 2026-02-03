import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Flame, Clock, MessageSquare, Heart } from 'lucide-react';

const API_KEY = 'AIzaSyCyQ7fHPWxAikeMfO6Rmyzn8KYx4JjNtFo';
const YOUTUBE_URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=12&regionCode=US&key=${API_KEY}`;

const Explore = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(YOUTUBE_URL);
        const data = await response.json();
        setVideos(data.items || []);
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views;
  };

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white pt-32 pb-20 px-6 md:px-12 font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full opacity-30" />
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="p-2 bg-red-600/20 rounded-lg text-red-600">
            <Flame size={20} fill="currentColor" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Trending Now</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
        >
          Explore <span className="text-red-600 italic">Global</span> Content
        </motion.h1>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
        {loading ? (
          // Skeleton Loading State
          [...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-zinc-900 rounded-3xl mb-4" />
              <div className="h-4 bg-zinc-900 rounded w-3/4 mb-2" />
              <div className="h-4 bg-zinc-900 rounded w-1/2" />
            </div>
          ))
        ) : (
          videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 mb-4">
                <img 
                  src={video.snippet.thumbnails.high.url} 
                  alt={video.snippet.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                
                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-4 bg-red-600 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                    <Play size={24} fill="white" />
                  </div>
                </div>

                {/* Statistics Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/70">
                   <div className="flex items-center gap-1.5">
                      <Heart size={12} className="text-red-600" />
                      {formatViews(video.statistics.likeCount || 0)}
                   </div>
                   <div className="flex items-center gap-1.5">
                      <MessageSquare size={12} />
                      {formatViews(video.statistics.commentCount || 0)}
                   </div>
                </div>
              </div>

              {/* Info */}
              <div className="px-1">
                <h3 className="font-bold text-sm line-clamp-2 leading-tight mb-2 group-hover:text-red-500 transition-colors">
                  {video.snippet.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-black uppercase tracking-wider">
                  <span>{video.snippet.channelTitle}</span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>{formatViews(video.statistics.viewCount)} Views</span>
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