import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Youtube,
  Play,
  Eye,
  ThumbsUp,
  Clock,
  ChevronRight,
  AlertCircle,
  Loader2,
  ExternalLink,
  Search,
  Grid3X3,
  List,
  TrendingUp,
  Calendar,
  RefreshCw,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const formatCount = (n) => {
  if (!n) return '—';
  const num = parseInt(n, 10);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

const formatDuration = (iso) => {
  if (!iso) return '';
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  const h = parseInt(match[1] || 0);
  const m = parseInt(match[2] || 0);
  const s = parseInt(match[3] || 0);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

/** Extract channel ID or handle from any YouTube channel URL */
const parseChannelInput = (input) => {
  input = input.trim();
  // Already a plain channel ID (UCxxxxxxxx)
  if (/^UC[\w-]{22}$/.test(input)) return { type: 'id', value: input };

  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    const path = url.pathname.replace(/\/$/, '');

    // /channel/UCxxxxxxxx
    const channelMatch = path.match(/\/channel\/(UC[\w-]{22})/);
    if (channelMatch) return { type: 'id', value: channelMatch[1] };

    // /@handle or /c/name or /user/name
    const handleMatch = path.match(/\/@([\w.-]+)/);
    if (handleMatch) return { type: 'handle', value: `@${handleMatch[1]}` };

    const customMatch = path.match(/\/(?:c|user)\/([\w.-]+)/);
    if (customMatch) return { type: 'handle', value: customMatch[1] };

    // bare path segment
    const bare = path.replace('/', '');
    if (bare) return { type: 'handle', value: bare };
  } catch (_) {}

  // Plain handle without URL
  if (input.startsWith('@')) return { type: 'handle', value: input };
  return { type: 'handle', value: input };
};

/** Resolve a handle/username to a channel ID via YouTube API */
const resolveChannelId = async (parsed) => {
  if (parsed.type === 'id') return parsed.value;

  const handle = parsed.value.replace(/^@/, '');

  // Try forHandle (new API)
  const r1 = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent('@' + handle)}&key=${API_KEY}`
  );
  const d1 = await r1.json();
  if (d1.items?.[0]?.id) return d1.items[0].id;

  // Try forUsername (legacy)
  const r2 = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${encodeURIComponent(handle)}&key=${API_KEY}`
  );
  const d2 = await r2.json();
  if (d2.items?.[0]?.id) return d2.items[0].id;

  throw new Error(`Could not resolve channel "${parsed.value}". Try pasting the full channel URL.`);
};

/* ─────────────────────────────────────────────
   Video Card — Grid variant
───────────────────────────────────────────── */
const VideoCardGrid = ({ video, index, onSelect, isSelected }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: Math.min(index * 0.04, 0.6), duration: 0.45 }}
    onClick={() => onSelect(video)}
    className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300
      ${isSelected
        ? 'border-red-500/60 bg-red-500/[0.06] shadow-[0_0_30px_rgba(220,38,38,0.15)]'
        : 'border-white/[0.07] bg-white/[0.025] hover:border-red-500/30 hover:bg-white/[0.05]'
      }`}
  >
    {/* Thumbnail */}
    <div className="relative aspect-video overflow-hidden bg-zinc-900">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
      {/* Duration badge */}
      {video.duration && (
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold font-mono">
          {video.duration}
        </span>
      )}
      {/* Play overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
          <Play size={20} fill="white" className="text-white ml-0.5" />
        </div>
      </div>
      {/* Selected tick */}
      {isSelected && (
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
          <CheckCircle2 size={14} className="text-white" />
        </div>
      )}
    </div>

    {/* Info */}
    <div className="p-4">
      <h3 className="text-white text-[13px] font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-red-300 transition-colors">
        {video.title}
      </h3>
      <div className="flex items-center gap-3 text-zinc-500 text-[11px] font-medium flex-wrap">
        <span className="flex items-center gap-1"><Eye size={10} />{formatCount(video.views)}</span>
        <span className="flex items-center gap-1"><ThumbsUp size={10} />{formatCount(video.likes)}</span>
        <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(video.publishedAt)}</span>
      </div>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Video Card — List variant
───────────────────────────────────────────── */
const VideoCardList = ({ video, index, onSelect, isSelected }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.4 }}
    onClick={() => onSelect(video)}
    className={`group cursor-pointer flex gap-4 p-3 rounded-2xl border transition-all duration-300
      ${isSelected
        ? 'border-red-500/60 bg-red-500/[0.06]'
        : 'border-white/[0.06] bg-white/[0.02] hover:border-red-500/25 hover:bg-white/[0.04]'
      }`}
  >
    {/* Thumbnail */}
    <div className="relative w-40 shrink-0 rounded-xl overflow-hidden bg-zinc-900 aspect-video">
      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      {video.duration && (
        <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-white text-[9px] font-bold font-mono">
          {video.duration}
        </span>
      )}
    </div>
    {/* Info */}
    <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
      <h3 className="text-white text-[13px] font-semibold leading-snug line-clamp-2 group-hover:text-red-300 transition-colors">
        {video.title}
      </h3>
      <div className="flex items-center gap-3 text-zinc-500 text-[11px] font-medium flex-wrap">
        <span className="flex items-center gap-1"><Eye size={10} />{formatCount(video.views)}</span>
        <span className="flex items-center gap-1"><ThumbsUp size={10} />{formatCount(video.likes)}</span>
        <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(video.publishedAt)}</span>
      </div>
    </div>
    {isSelected && <CheckCircle2 size={18} className="text-red-500 shrink-0 self-center" />}
  </motion.div>
);

/* ─────────────────────────────────────────────
   Channel Header
───────────────────────────────────────────── */
const ChannelHeader = ({ channel, videoCount, onReset }) => (
  <motion.div
    initial={{ opacity: 0, y: -16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.07]"
  >
    <img src={channel.avatar} alt={channel.name} className="w-20 h-20 rounded-full border-2 border-red-500/40 shrink-0" />
    <div className="flex-1 text-center sm:text-left">
      <h2 className="text-white text-xl font-black tracking-tight mb-1">{channel.name}</h2>
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-zinc-400 text-xs font-medium mb-3">
        <span className="flex items-center gap-1"><TrendingUp size={12} />{formatCount(channel.subscribers)} subscribers</span>
        <span className="flex items-center gap-1"><Play size={12} />{formatCount(channel.videoCount)} videos</span>
        <span className="flex items-center gap-1 text-green-400"><CheckCircle2 size={12} />{videoCount} loaded</span>
      </div>
      <p className="text-zinc-600 text-xs line-clamp-2 max-w-lg">{channel.description}</p>
    </div>
    <div className="flex gap-2 shrink-0">
      <a
        href={`https://youtube.com/channel/${channel.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/10 border border-red-600/20 text-red-400 text-xs font-bold hover:bg-red-600/20 transition-colors"
      >
        <ExternalLink size={12} /> View
      </a>
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 text-xs font-bold hover:bg-white/[0.08] transition-colors"
      >
        <RefreshCw size={12} /> Change
      </button>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Main Connect Page
───────────────────────────────────────────── */
const ConnectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-filled URL passed from Landing
  const initialUrl = location.state?.channelUrl || '';

  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalLoaded, setTotalLoaded] = useState(0);

  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date'); // 'date' | 'views' | 'likes'
  const [selectedVideo, setSelectedVideo] = useState(null);

  const loaderRef = useRef(null);

  /* ── Auto-load if URL passed from Landing ── */
  useEffect(() => {
    if (initialUrl) handleConnect(null, initialUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Fetch channel info + first batch ── */
  const handleConnect = async (e, urlOverride) => {
    if (e) e.preventDefault();
    const url = (urlOverride || inputUrl).trim();
    if (!url) return;

    setLoading(true);
    setError('');
    setChannel(null);
    setVideos([]);
    setNextPageToken(null);
    setTotalLoaded(0);
    setSelectedVideo(null);

    try {
      const parsed = parseChannelInput(url);
      const channelId = await resolveChannelId(parsed);

      // Fetch channel info
      const chanRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
      );
      const chanData = await chanRes.json();
      if (!chanData.items?.length) throw new Error('Channel not found. Check the URL and try again.');

      const ch = chanData.items[0];
      setChannel({
        id: channelId,
        name: ch.snippet.title,
        description: ch.snippet.description,
        avatar: ch.snippet.thumbnails?.high?.url || ch.snippet.thumbnails?.default?.url,
        subscribers: ch.statistics.subscriberCount,
        videoCount: ch.statistics.videoCount,
      });

      // Fetch uploads playlist ID
      const uploadsPlaylistId = 'UU' + channelId.slice(2);

      await fetchVideoBatch(uploadsPlaylistId, null, []);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Fetch a batch of videos (50 per page, up to 2 pages = 100) ── */
  const fetchVideoBatch = useCallback(async (playlistId, pageToken, existing) => {
    const params = new URLSearchParams({
      part: 'snippet',
      playlistId,
      maxResults: 50,
      key: API_KEY,
      ...(pageToken ? { pageToken } : {}),
    });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`);
    const data = await res.json();

    if (!data.items) throw new Error(data.error?.message || 'Failed to fetch videos.');

    const videoIds = data.items.map((item) => item.snippet.resourceId.videoId).join(',');

    // Fetch details (stats + duration)
    const detailRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
    );
    const detailData = await detailRes.json();

    const enriched = (detailData.items || []).map((v) => ({
      id: v.id,
      title: v.snippet.title,
      thumbnail: v.snippet.thumbnails?.maxres?.url
        || v.snippet.thumbnails?.high?.url
        || v.snippet.thumbnails?.medium?.url,
      publishedAt: v.snippet.publishedAt,
      views: v.statistics?.viewCount,
      likes: v.statistics?.likeCount,
      duration: formatDuration(v.contentDetails?.duration),
      rawDuration: v.contentDetails?.duration,
      description: v.snippet.description || '',
    }));

    const merged = [...existing, ...enriched];
    setVideos(merged);
    setTotalLoaded(merged.length);
    setNextPageToken(data.nextPageToken || null);

    // Automatically load second page to reach ~100
    if (data.nextPageToken && merged.length < 100) {
      await fetchVideoBatch(playlistId, data.nextPageToken, merged);
    }

    // Store playlist ID on channel for "load more" button
    setChannel((prev) => prev ? { ...prev, uploadsPlaylistId: playlistId } : prev);
  }, []);

  /* ── Load more (manual) ── */
  const handleLoadMore = async () => {
    if (!nextPageToken || !channel?.uploadsPlaylistId || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchVideoBatch(channel.uploadsPlaylistId, nextPageToken, videos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    setChannel(null);
    setVideos([]);
    setInputUrl('');
    setError('');
    setSelectedVideo(null);
  };

  /* ── Filter + sort ── */
  const filteredVideos = videos
    .filter((v) => v.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'views') return parseInt(b.views || 0) - parseInt(a.views || 0);
      if (sort === 'likes') return parseInt(b.likes || 0) - parseInt(a.likes || 0);
      return new Date(b.publishedAt) - new Date(a.publishedAt); // date
    });

  /* ── Video detail modal ── */
  const handleSelectVideo = (video) => {
    setSelectedVideo((prev) => (prev?.id === video.id ? null : video));
  };

  const handleUseVideo = () => {
    if (!selectedVideo) return;
    navigate('/ask-ai', { state: { videoId: selectedVideo.id, videoTitle: selectedVideo.title } });
  };

  // Navigate to Ask AI — pass channelId so AskAI can fetch ALL videos itself
  const handleAskAIAll = () => {
    navigate('/ask-ai', {
      state: {
        channelId: channel.id,
        channelName: channel?.name || '',
        channelAvatar: channel?.avatar || '',
        totalVideos: parseInt(channel?.videoCount || 0),
      },
    });
  };

  /* ─────────── RENDER ─────────── */
  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden relative">
      <Navbar />

      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-600/[0.08] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-24">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/[0.07] text-red-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Youtube size={10} fill="currentColor" /> Channel Connect
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Browse <span className="text-red-500">Channel.</span>
            </h1>
            {channel && videos.length > 0 && (
              <button
                onClick={handleAskAIAll}
                className="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-base md:text-lg font-black uppercase tracking-tight rounded-2xl transition-all shadow-[0_4px_20px_rgba(220,38,38,0.35)] active:scale-95 cursor-pointer"
              >
                <Sparkles size={20} />
                Search All {videos.length} Videos
              </button>
            )}
          </div>
          <p className="text-zinc-500 text-sm font-medium max-w-lg">
            Paste any YouTube channel URL below to load up to 100 of their latest videos, then pick one to analyse with AI.
          </p>
        </motion.div>

        {/* ── URL Input form (hidden after channel loads) ── */}
        <AnimatePresence mode="wait">
          {!channel && (
            <motion.form
              key="input-form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              onSubmit={handleConnect}
              className="mb-10 max-w-2xl"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 bg-[#111] border border-white/[0.09] rounded-2xl px-5 py-3.5 focus-within:border-red-500/50 transition-colors">
                  <Youtube size={18} className="text-red-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="https://youtube.com/@channelname"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full bg-transparent text-[14px] font-semibold text-white outline-none placeholder:text-zinc-600"
                  />
                  {inputUrl && (
                    <button type="button" onClick={() => setInputUrl('')}>
                      <X size={14} className="text-zinc-600 hover:text-white transition-colors" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || !inputUrl.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black uppercase tracking-tight text-sm rounded-2xl transition-all shadow-[0_4px_20px_rgba(220,38,38,0.35)] active:scale-95"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} strokeWidth={3} />}
                  {loading ? 'Loading…' : 'Connect'}
                </button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-medium"
                  >
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-5 py-24">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-red-500/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-red-500 animate-spin" />
              <Youtube size={24} className="absolute inset-0 m-auto text-red-500" fill="currentColor" />
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg uppercase tracking-widest mb-1">Connecting…</p>
              <p className="text-zinc-600 text-xs">Fetching channel data and videos</p>
            </div>
          </div>
        )}

        {/* ── Channel loaded ── */}
        {channel && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Channel header */}
            <ChannelHeader channel={channel} videoCount={totalLoaded} onReset={handleReset} />

            {/* Error banner (after load) */}
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-medium">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            {/* ── Toolbar ── */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex-1 min-w-[200px] flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 focus-within:border-red-500/40 transition-colors">
                <Search size={14} className="text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Filter videos…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-[13px] font-semibold text-white outline-none placeholder:text-zinc-600"
                />
                {search && (
                  <button onClick={() => setSearch('')}>
                    <X size={12} className="text-zinc-600 hover:text-white transition-colors" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                {[
                  { key: 'date', icon: <Clock size={13} />, label: 'Newest' },
                  { key: 'views', icon: <Eye size={13} />, label: 'Views' },
                  { key: 'likes', icon: <ThumbsUp size={13} />, label: 'Likes' },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSort(s.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all ${
                      sort === s.key ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  <Grid3X3 size={14} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  <List size={14} />
                </button>
              </div>

              {/* Count badge */}
              <span className="text-zinc-600 text-[11px] font-semibold ml-auto hidden sm:block">
                {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* ── Video grid / list ── */}
            {filteredVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-3">
                <Search size={32} />
                <p className="text-sm font-semibold">No videos match "{search}"</p>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredVideos.map((video, i) => (
                  <VideoCardGrid
                    key={video.id}
                    video={video}
                    index={i}
                    onSelect={handleSelectVideo}
                    isSelected={selectedVideo?.id === video.id}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredVideos.map((video, i) => (
                  <VideoCardList
                    key={video.id}
                    video={video}
                    index={i}
                    onSelect={handleSelectVideo}
                    isSelected={selectedVideo?.id === video.id}
                  />
                ))}
              </div>
            )}

            {/* ── Load more ── */}
            {nextPageToken && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.09] text-white text-sm font-black uppercase tracking-widest hover:bg-white/[0.09] disabled:opacity-50 transition-all"
                >
                  {loadingMore ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                  {loadingMore ? 'Loading…' : `Load More (${totalLoaded} loaded so far)`}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* ════════════════════════════
          SELECTED VIDEO BOTTOM BAR
      ════════════════════════════ */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 inset-x-0 z-50 p-4 pb-6"
          >
            <div className="max-w-3xl mx-auto flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#111]/95 border border-white/10 backdrop-blur-xl shadow-[0_-10px_60px_rgba(0,0,0,0.6)]">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-16 h-10 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-[13px] font-semibold truncate">{selectedVideo.title}</p>
                <p className="text-zinc-500 text-[11px] font-medium mt-0.5">
                  {formatCount(selectedVideo.views)} views · {selectedVideo.duration}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://youtube.com/watch?v=${selectedVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-zinc-400 text-xs font-bold hover:bg-white/[0.1] transition-colors"
                >
                  <ExternalLink size={12} /> Watch
                </a>
                <button
                  onClick={handleUseVideo}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wide transition-all shadow-[0_2px_12px_rgba(220,38,38,0.4)] active:scale-95"
                >
                  <Sparkles size={12} /> Analyse with AI
                  <ChevronRight size={12} strokeWidth={3} />
                </button>
              </div>
              <button onClick={() => setSelectedVideo(null)} className="text-zinc-600 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectPage;