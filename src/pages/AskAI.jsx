import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Zap, Loader2, Play, ArrowLeft, Copy,
  Check, ExternalLink, AlertCircle, Scissors,
  Search, X, Film, MessageSquare, Youtube,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const YT_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const toSeconds = (ts) => {
  if (!ts) return 0;
  const parts = String(ts).split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
};

const parseChapters = (description) => {
  if (!description) return [];
  const timeRegex = /(\d{1,2}:\d{2}(?::\d{2})?)/;
  return description.split('\n').reduce((acc, line) => {
    const match = line.match(timeRegex);
    if (match) {
      const raw = match[1];
      const label = line.replace(raw, '').replace(/^[\s\-–—:]+|[\s\-–—:]+$/g, '').trim();
      if (label.length > 1) acc.push({ raw, seconds: toSeconds(raw), label });
    }
    return acc;
  }, []);
};

/* ─────────────────────────────────────────────
   Fetch ALL videos of a channel via playlist API
   Pages through until no nextPageToken
───────────────────────────────────────────── */
const fetchAllChannelVideos = async (channelId, onProgress) => {
  const uploadsPlaylistId = 'UU' + channelId.slice(2);
  let pageToken = null;
  let allVideos = [];
  let page = 0;

  do {
    page++;
    const params = new URLSearchParams({
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      key: YT_KEY,
      ...(pageToken ? { pageToken } : {}),
    });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`);
    const data = await res.json();

    if (!data.items?.length) break;

    // Fetch video details (thumbnail, duration) in one batch
    const ids = data.items.map(i => i.snippet.resourceId.videoId).join(',');
    const detailRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${ids}&key=${YT_KEY}`
    );
    const detailData = await detailRes.json();

    const batch = (detailData.items || []).map(v => {
      const iso = v.contentDetails?.duration || '';
      const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const h = parseInt(match?.[1] || 0), m = parseInt(match?.[2] || 0), s = parseInt(match?.[3] || 0);
      const duration = h > 0
        ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
        : `${m}:${String(s).padStart(2,'0')}`;
      return {
        id: v.id,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.medium?.url || '',
        description: v.snippet.description || '',
        publishedAt: v.snippet.publishedAt,
        duration,
      };
    });

    allVideos = [...allVideos, ...batch];
    pageToken = data.nextPageToken || null;

    if (onProgress) onProgress(allVideos.length, pageToken != null);
  } while (pageToken);

  return allVideos;
};

/* Fetch full descriptions for a list of video IDs */
const fetchFullDescriptions = async (videoIds) => {
  if (!videoIds.length) return {};
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${YT_KEY}`
  );
  const data = await res.json();
  const map = {};
  (data.items || []).forEach(v => { map[v.id] = v.snippet.description || ''; });
  return map;
};

/* ─────────────────────────────────────────────
   Rich text renderer
───────────────────────────────────────────── */
const InlineBold = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
};

const RichText = ({ text }) => {
  if (!text) return null;
  return (
    <div className="space-y-2">
      {text.split('\n').filter(l => l.trim()).map((line, i) => {
        const t = line.trim();
        if (t.startsWith('- ') || t.startsWith('• '))
          return (
            <div key={i} className="flex gap-2.5 items-start">
              <span className="shrink-0 mt-[6px] w-1.5 h-1.5 rounded-full bg-red-500/60" />
              <p className="text-zinc-300 text-[13px] leading-relaxed"><InlineBold text={t.replace(/^[-•]\s+/, '')} /></p>
            </div>
          );
        if (t.startsWith('#'))
          return <p key={i} className="text-white text-[13px] font-black uppercase tracking-wide mt-2">{t.replace(/^#+\s*/, '')}</p>;
        return <p key={i} className="text-zinc-300 text-[13px] leading-relaxed"><InlineBold text={t} /></p>;
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Clip Card
───────────────────────────────────────────── */
const ClipCard = ({ clip, onPlay, isPlaying }) => {
  const [copied, setCopied] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`group rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer ${
        isPlaying
          ? 'border-red-500/60 bg-red-500/[0.05] shadow-[0_0_24px_rgba(220,38,38,0.15)]'
          : 'border-white/[0.08] bg-white/[0.025] hover:border-red-500/30 hover:bg-white/[0.04]'
      }`}
      onClick={() => onPlay(clip)}
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-900">
        {clip.thumbnail
          ? <img src={clip.thumbnail} alt={clip.videoTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center"><Film size={20} className="text-zinc-700" /></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-red-600 text-white font-mono text-[10px] font-black shadow-lg">
          <Play size={8} fill="white" />{clip.timestamp}
        </div>
        {isPlaying && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-600 text-white text-[9px] font-black uppercase">
            <span className="w-1 h-1 rounded-full bg-white animate-ping" />Playing
          </div>
        )}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center shadow-xl">
              <Play size={16} fill="white" className="ml-0.5" />
            </div>
          </div>
        )}
      </div>
      <div className="px-3 pt-2.5 pb-3">
        <p className="text-red-400/70 text-[9px] font-black uppercase tracking-widest truncate mb-1">{clip.videoTitle}</p>
        <p className="text-white text-[12px] font-semibold leading-snug line-clamp-2 mb-1">{clip.label}</p>
        {clip.reason && <p className="text-zinc-500 text-[11px] leading-relaxed line-clamp-2 mb-2">{clip.reason}</p>}
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          <button onClick={() => { navigator.clipboard.writeText(`https://youtube.com/watch?v=${clip.videoId}&t=${clip.seconds}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-zinc-500 hover:text-white transition-all">
            {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
          </button>
          <a href={`https://youtube.com/watch?v=${clip.videoId}&t=${clip.seconds}`} target="_blank" rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-zinc-500 hover:text-white transition-all">
            <ExternalLink size={11} />
          </a>
          <span className="ml-auto text-zinc-700 font-mono text-[10px]">{clip.timestamp}</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Inline Player
───────────────────────────────────────────── */
const InlinePlayer = ({ clip, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
    className="rounded-2xl overflow-hidden border border-red-500/30 bg-black shadow-[0_16px_48px_rgba(0,0,0,0.7)]"
  >
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#111] border-b border-white/[0.06]">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
        <p className="text-white text-[12px] font-semibold truncate">{clip.videoTitle}</p>
        <span className="shrink-0 px-2 py-0.5 rounded bg-red-600/20 border border-red-500/30 text-red-400 font-mono text-[10px] font-black">{clip.timestamp}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <a href={`https://youtube.com/watch?v=${clip.videoId}&t=${clip.seconds}`} target="_blank" rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-all"><ExternalLink size={13} /></a>
        <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-all"><X size={13} /></button>
      </div>
    </div>
    <div className="relative" style={{ aspectRatio: '16/9' }}>
      <iframe
        key={`${clip.videoId}-${clip.seconds}`}
        width="100%" height="100%"
        src={`https://www.youtube-nocookie.com/embed/${clip.videoId}?autoplay=1&start=${clip.seconds}&modestbranding=1&rel=0&fs=1`}
        frameBorder="0" allow="autoplay; encrypted-media; fullscreen" allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
    {clip.reason && (
      <div className="px-4 py-2.5 bg-[#111] border-t border-white/[0.05]">
        <p className="text-zinc-500 text-[11px]"><span className="text-red-400 font-semibold">Why: </span>{clip.reason}</p>
      </div>
    )}
  </motion.div>
);

/* ─────────────────────────────────────────────
   Loading screen shown while indexing all videos
───────────────────────────────────────────── */
const IndexingScreen = ({ count, total, channelName, channelAvatar }) => (
  <div className="flex flex-col items-center justify-center h-full gap-8 text-center px-8">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-2 border-red-500/20" />
      <div className="absolute inset-0 rounded-full border-t-2 border-red-500 animate-spin" />
      {channelAvatar
        ? <img src={channelAvatar} alt={channelName} className="absolute inset-2 rounded-full object-cover" />
        : <Youtube size={28} className="absolute inset-0 m-auto text-red-500" fill="currentColor" />
      }
    </div>
    <div>
      <p className="text-white text-xl font-black uppercase tracking-tight mb-2">Indexing Channel</p>
      <p className="text-zinc-500 text-sm mb-4">Fetching all videos from <span className="text-white font-semibold">{channelName}</span></p>
      {/* Progress bar */}
      <div className="w-64 mx-auto">
        <div className="flex justify-between text-zinc-600 text-[10px] font-semibold mb-2">
          <span>{count} fetched</span>
          {total > 0 && <span>of ~{total} total</span>}
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-red-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: total > 0 ? `${Math.min((count / total) * 100, 95)}%` : '60%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
    <p className="text-zinc-700 text-[11px]">This happens once — all future questions search the full channel</p>
  </div>
);

/* ─────────────────────────────────────────────
   Main AskAI Page
───────────────────────────────────────────── */
const AskAi = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    channelId = '',
    channelName = '',
    channelAvatar = '',
    totalVideos = 0,
  } = location.state || {};

  // All videos fetched from the channel
  const [allVideos, setAllVideos] = useState([]);
  const [indexing, setIndexing] = useState(false);
  const [indexCount, setIndexCount] = useState(0);
  const [indexError, setIndexError] = useState('');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStatus, setThinkingStatus] = useState('');
  const [activeClip, setActiveClip] = useState(null);

  const scrollRef = useRef(null);
  const hasFetched = useRef(false);

  const isReady = allVideos.length > 0;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isThinking, activeClip]);

  /* ── On mount: fetch ALL channel videos ── */
  useEffect(() => {
    if (!channelId || hasFetched.current) return;
    hasFetched.current = true;

    setIndexing(true);
    fetchAllChannelVideos(channelId, (count, hasMore) => {
      setIndexCount(count);
    })
      .then(videos => {
        setAllVideos(videos);
        setIndexing(false);
        setMessages([{
          role: 'assistant',
          answer: `Indexed **${videos.length} videos** from **${channelName}** — every single upload is now searchable.\n\nAsk me anything about this channel and I'll find the exact timestamps across all videos.`,
          clips: [],
        }]);
      })
      .catch(err => {
        setIndexError(err.message);
        setIndexing(false);
      });
  }, [channelId]);

  /* ─── AI helpers ─── */
  const callAI = async (systemPrompt, userPrompt, maxTokens = 300) => {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: maxTokens,
        temperature: 0.2,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  };

  /* Step 1 — find relevant video IDs from full catalogue */
  const findRelevantVideos = async (query, videos) => {
    const BATCH = 50;
    let found = [];
    for (let i = 0; i < videos.length; i += BATCH) {
      const batch = videos.slice(i, i + BATCH);
      const list = batch.map((v, idx) =>
        `${idx + 1}. ID:${v.id} | "${v.title}" | ${v.description.slice(0, 120).replace(/\n/g, ' ')}`
      ).join('\n');

      const raw = await callAI(
        'Return only a valid JSON array of video IDs. No markdown, no explanation.',
        `Find videos relevant to: "${query}"\n\nVIDEOS:\n${list}\n\nReturn JSON array of matching IDs, max 5 per batch. If none match return [].`
      );
      const clean = raw.replace(/```json|```/g, '').trim();
      try {
        const arr = JSON.parse(clean);
        if (Array.isArray(arr)) found = [...found, ...arr];
      } catch {
        const match = clean.match(/\[[\s\S]*\]/);
        if (match) try { const arr = JSON.parse(match[0]); if (Array.isArray(arr)) found = [...found, ...arr]; } catch {}
      }
    }
    return [...new Set(found)].filter(id => videos.find(v => v.id === id)).slice(0, 8);
  };

  /* Step 2 — deep analyze one video */
  const analyzeVideo = async (query, video, fullDescription) => {
    const chapters = parseChapters(fullDescription);
    const chapterBlock = chapters.length > 0
      ? `CHAPTERS:\n${chapters.map(c => `  [${c.raw}] (${c.seconds}s) ${c.label}`).join('\n')}`
      : 'NO CHAPTERS — estimate from description.';

    const raw = await callAI(
      'You are a YouTube video analyst. Return only valid JSON. No markdown fences.',
      `Analyze this video to answer the user question with exact timestamps.

VIDEO: "${video.title}"
ID: ${video.id}
DURATION: ${video.duration || 'unknown'}

${chapterBlock}

DESCRIPTION:
${fullDescription.slice(0, 2500)}

QUESTION: "${query}"

Return JSON:
{
  "answer": "2-4 sentence answer about this video with **bold** key points",
  "clips": [
    {"videoId":"${video.id}","timestamp":"MM:SS","seconds":123,"label":"max 7 words","reason":"why this moment answers the question"}
  ]
}
Max 3 clips. If video doesn't cover this: {"answer":"","clips":[]}`,
      900
    );

    const clean = raw.replace(/```json|```/g, '').trim();
    try { return JSON.parse(clean); }
    catch { const m = clean.match(/\{[\s\S]*\}/); try { return JSON.parse(m?.[0] || '{}'); } catch { return { answer: '', clips: [] }; } }
  };

  /* Step 3 — synthesize answer across videos */
  const synthesizeAnswer = async (query, videoAnswers) => {
    if (videoAnswers.length === 1) return videoAnswers[0].answer;
    const summaries = videoAnswers.filter(v => v.answer).map(v => `"${v.title}": ${v.answer}`).join('\n\n');
    return await callAI(
      'Write clear, concise answers. No JSON, no markdown fences.',
      `User asked: "${query}"\n\nAnswers from multiple videos:\n${summaries}\n\nWrite a 3-5 sentence combined answer using **bold** for key points and "- " for bullet lists.`,
      600
    );
  };

  /* ─── Main send handler ─── */
  const handleSend = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isThinking || !isReady) return;

    setInput('');
    setActiveClip(null);
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsThinking(true);

    try {
      const videoMap = Object.fromEntries(allVideos.map(v => [v.id, v]));

      setThinkingStatus(`Searching ${allVideos.length} videos…`);
      const relevantIds = await findRelevantVideos(query, allVideos);

      if (!relevantIds.length) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          answer: `I searched all **${allVideos.length} videos** from **${channelName}** but found no videos covering **"${query}"**.\n\nTry different keywords that might appear in a video title.`,
          clips: [],
        }]);
        return;
      }

      setThinkingStatus(`Fetching full content for ${relevantIds.length} video${relevantIds.length > 1 ? 's' : ''}…`);
      const descMap = await fetchFullDescriptions(relevantIds);

      const videoAnswers = [];
      const allClips = [];

      for (let idx = 0; idx < relevantIds.length; idx++) {
        const id = relevantIds[idx];
        const video = videoMap[id];
        setThinkingStatus(`Analyzing "${video.title.slice(0, 45)}…" (${idx + 1}/${relevantIds.length})`);

        const result = await analyzeVideo(query, video, descMap[id] || video.description || '');
        if (result.answer) videoAnswers.push({ title: video.title, answer: result.answer });
        if (Array.isArray(result.clips)) {
          allClips.push(...result.clips.filter(c => c.videoId && c.timestamp).map(c => ({
            ...c,
            seconds: typeof c.seconds === 'number' ? c.seconds : toSeconds(c.timestamp),
            videoTitle: video.title,
            thumbnail: video.thumbnail || '',
          })));
        }
      }

      setThinkingStatus('Writing answer…');
      const finalAnswer = videoAnswers.length > 0
        ? await synthesizeAnswer(query, videoAnswers)
        : `Found **${allClips.length} clip${allClips.length !== 1 ? 's' : ''}** across **${relevantIds.length} video${relevantIds.length !== 1 ? 's' : ''}**.`;

      const seen = new Set();
      const dedupedClips = allClips.filter(c => {
        const k = `${c.videoId}-${c.seconds}`;
        if (seen.has(k)) return false;
        seen.add(k); return true;
      });

      setMessages(prev => [...prev, { role: 'assistant', answer: finalAnswer, clips: dedupedClips }]);

    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', answer: '', clips: [], error: `Search failed: ${err.message}` }]);
    } finally {
      setIsThinking(false);
      setThinkingStatus('');
    }
  };

  /* ─────────── RENDER ─────────── */
  return (
    <div className="h-screen w-full bg-[#080808] text-white flex flex-col overflow-hidden">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[20%] w-[500px] h-[300px] bg-red-600/[0.06] blur-[130px] rounded-full" />
        <div className="absolute bottom-[5%] right-[10%] w-[300px] h-[200px] bg-violet-600/[0.04] blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 overflow-hidden pt-16">

        {/* Top bar */}
        <div className="shrink-0 px-5 py-3 border-b border-white/[0.06] bg-[#0a0a0a] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate(-1)}
              className="shrink-0 p-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all">
              <ArrowLeft size={14} />
            </button>
            {channelAvatar && <img src={channelAvatar} alt={channelName} className="w-7 h-7 rounded-full border border-white/10 shrink-0" />}
            <div className="min-w-0">
              <p className="text-white text-[13px] font-black truncate">{channelName || 'Channel AI'}</p>
              <p className="text-zinc-600 text-[10px] font-semibold">
                {indexing ? `Indexing… ${indexCount} fetched` : `${allVideos.length} videos indexed`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {indexing
              ? <Loader2 size={14} className="text-red-500 animate-spin" />
              : <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
            }
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest hidden sm:block">
              {indexing ? 'Indexing all videos…' : 'Full channel indexed'}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden flex flex-col">

          {/* Indexing screen */}
          {indexing && (
            <IndexingScreen
              count={indexCount}
              total={totalVideos}
              channelName={channelName}
              channelAvatar={channelAvatar}
            />
          )}

          {/* Index error */}
          {indexError && !indexing && (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <AlertCircle size={32} className="text-red-500" />
              <p className="text-red-400 text-sm font-semibold">{indexError}</p>
              <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-sm font-bold hover:bg-white/[0.1] transition-colors">
                <ArrowLeft size={14} /> Go back
              </button>
            </div>
          )}

          {/* Chat — only shown when indexed */}
          {!indexing && !indexError && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-8 max-w-4xl mx-auto w-full">

                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-20">
                    <div className="w-20 h-20 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                      <Scissors size={36} className="text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-white text-2xl font-black uppercase tracking-tight mb-2">Ask Anything</h3>
                      <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed">
                        All {allVideos.length} videos indexed. Ask about any topic and I'll find the exact clips.
                      </p>
                    </div>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                      {msg.role === 'user' && (
                        <div className="flex justify-end">
                          <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm bg-white/[0.07] border border-white/[0.1] text-white text-[14px] font-medium">
                            {msg.content}
                          </div>
                        </div>
                      )}

                      {msg.role === 'assistant' && (
                        <div className="space-y-5">
                          {(msg.answer || msg.error) && (
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                                <MessageSquare size={14} className="text-red-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                {msg.answer && (
                                  <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-white/[0.03] border border-white/[0.07]">
                                    <RichText text={msg.answer} />
                                  </div>
                                )}
                                {msg.error && (
                                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-[12px] mt-2">
                                    <AlertCircle size={12} /> {msg.error}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {msg.clips && msg.clips.length > 0 && (
                            <div className="pl-11">
                              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <Scissors size={10} />
                                {msg.clips.length} clip{msg.clips.length !== 1 ? 's' : ''} · {new Set(msg.clips.map(c => c.videoId)).size} video{new Set(msg.clips.map(c => c.videoId)).size !== 1 ? 's' : ''}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                {msg.clips.map((clip, ci) => (
                                  <ClipCard
                                    key={`${clip.videoId}-${clip.seconds}-${ci}`}
                                    clip={clip}
                                    onPlay={c => setActiveClip(activeClip?.videoId === c.videoId && activeClip?.seconds === c.seconds ? null : c)}
                                    isPlaying={activeClip?.videoId === clip.videoId && activeClip?.seconds === clip.seconds}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          <AnimatePresence>
                            {activeClip && msg.clips?.some(c => c.videoId === activeClip.videoId && c.seconds === activeClip.seconds) && (
                              <div className="pl-11">
                                <InlinePlayer clip={activeClip} onClose={() => setActiveClip(null)} />
                              </div>
                            )}
                          </AnimatePresence>

                          {msg.clips && msg.clips.length === 0 && !msg.error && msg.answer && (
                            <div className="pl-11 flex items-center gap-2 text-zinc-600 text-[11px]">
                              <Search size={11} /> No timestamped clips found for this video.
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isThinking && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
                      <Loader2 size={13} className="text-red-500 animate-spin" />
                    </div>
                    <div className="flex flex-col gap-2 pt-1.5">
                      <div className="flex items-center gap-1">
                        {[0, 120, 240].map(d => (
                          <span key={d} className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                      {thinkingStatus && <p className="text-zinc-500 text-[11px] font-medium">{thinkingStatus}</p>}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="shrink-0 border-t border-white/[0.06] bg-[#0a0a0a] px-4 md:px-8 py-4">
                <div className="max-w-4xl mx-auto">
                  <form onSubmit={handleSend} className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-2 focus-within:border-red-500/40 transition-colors">
                    <Zap size={15} className="text-red-500 shrink-0" />
                    <input
                      type="text"
                      placeholder={isReady ? `Ask anything about all ${allVideos.length} videos…` : 'Indexing channel, please wait…'}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      disabled={!isReady || isThinking}
                      className="flex-1 bg-transparent text-[13px] py-3 text-white outline-none placeholder:text-zinc-700 font-medium disabled:opacity-40"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isThinking || !isReady}
                      className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
                    >
                      {isThinking ? <Loader2 size={14} className="animate-spin text-white" /> : <Send size={14} className="text-white" />}
                    </button>
                  </form>
                  <p className="text-zinc-800 text-[10px] font-medium mt-2 text-center">
                    Searches every video ever uploaded · click any clip to play that exact part
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AskAi;
