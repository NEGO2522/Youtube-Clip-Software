import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Flame, Clock, Loader2, Search as SearchIcon, AlertTriangle } from 'lucide-react';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// PLACEHOLDER DATA: This shows up if your API key fails or hits a 403.
const MOCK_VIDEOS = [
  { id: 'dQw4w9WgXcQ', snippet: { title: 'System Architecture: High-Performance Neural Networks', channelTitle: 'Clupe AI Labs', thumbnails: { high: { url: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000' } } }, statistics: { viewCount: '1.2M' } },
  { id: '36YnV9STBqc', snippet: { title: 'The Future of AI Agents in Neo-City', channelTitle: 'Cyber Research', thumbnails: { high: { url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000' } } }, statistics: { viewCount: '850K' } },
  { id: '2Vv-BfVoq4g', snippet: { title: 'Deep Learning with JavaScript: Next-Gen Frameworks', channelTitle: 'Code Terminal', thumbnails: { high: { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000' } } }, statistics: { viewCount: '2.4M' } },
  { id: 'f9m2y5f2j4k', snippet: { title: 'Ambient Cyber-Industrial Beats for Coding', channelTitle: 'Synth Records', thumbnails: { high: { url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000' } } }, statistics: { viewCount: '4.1M' } },
];

const Explore = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const observer = useRef();
  const lastVideoElementRef = useCallback(node => {
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextPageToken) fetchVideos(true);
    });
    if (node) observer.current.observe(node);
  }, [loading, isFetchingMore, nextPageToken]);

  const fetchVideos = async (isMore = false) => {
    if (isMore) setIsFetchingMore(true);
    else setLoading(true);
    setError(null);

    try {
      const pageParam = nextPageToken ? `&pageToken=${nextPageToken}` : "";
      const queryToUse = activeQuery || "Modern AI Technology|Cyberpunk Design";
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(queryToUse)}&type=video&key=${API_KEY}${pageParam}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      if (data.items) {
        const videoData = data.items.map(item => ({
          id: item.id.videoId,
          snippet: item.snippet,
          statistics: { viewCount: "HD Video" }
        }));
        setNextPageToken(data.nextPageToken || null);
        setVideos(prev => isMore ? [...prev, ...videoData] : videoData);
      }
    } catch (err) {
      console.error("API Error:", err.message);
      setError(err.message);
      // Only show mock data on the initial load if the API fails
      if (!isMore) setVideos(MOCK_VIDEOS); 
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setVideos([]);
    setNextPageToken(null);
    setActiveQuery(searchQuery);
  };

  useEffect(() => { fetchVideos(); }, [activeQuery]);

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white pt-32 pb-20 px-6 md:px-12 font-sans selection:bg-red-600/40">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full opacity-30" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex-1 text-left">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-600/20 rounded-lg text-red-600"><Flame size={18} fill="currentColor" /></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
              {activeQuery ? `Query: ${activeQuery}` : "Experimental Stream"}
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-6">
            Explore <span className="text-red-600">Space.</span>
          </motion.h1>
          <form onSubmit={handleSearch} className="relative group w-full max-w-lg">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="DECODE SEARCH PARAMETERS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-700"
            />
          </form>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-12 p-4 bg-red-600/5 border border-red-600/20 rounded-xl flex items-center gap-3 text-[10px] font-bold text-red-500 uppercase tracking-widest">
          <AlertTriangle size={14} /> Offline Mode: Displaying Encrypted Cache (API: {error})
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-video bg-white/5 rounded-[2rem]" />
              <div className="h-3 bg-white/5 rounded w-3/4 mx-2" />
            </div>
          ))
        ) : (
          videos.map((video, index) => (
            <motion.div
              key={`${video.id}-${index}`}
              ref={videos.length === index + 1 ? lastVideoElementRef : null}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
            >
              <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 mb-4 transition-all group-hover:border-red-600/50 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]">
                <img src={video.snippet.thumbnails.high?.url} alt="" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-4 bg-red-600 rounded-full scale-75 group-hover:scale-100 transition-transform"><Play size={20} fill="white" className="ml-1" /></div>
                </div>
              </div>
              <div className="px-2">
                <h3 className="font-bold text-xs uppercase tracking-tight line-clamp-2 mb-2 group-hover:text-red-500 transition-colors">{video.snippet.title}</h3>
                <div className="flex items-center justify-between text-[8px] text-zinc-600 font-black uppercase tracking-widest">
                  <span>{video.snippet.channelTitle}</span>
                  <div className="flex items-center gap-1"><Clock size={10} className="text-red-600" /> {video.statistics.viewCount}</div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {isFetchingMore && (
        <div className="w-full flex justify-center mt-12"><Loader2 className="animate-spin text-red-600" size={24} /></div>
      )}
    </div>
  );
};

export default Explore;