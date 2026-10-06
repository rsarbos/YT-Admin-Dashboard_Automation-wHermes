import React, { useState } from 'react';
import { VideoProject, Channel, ScheduledPost } from '../../types';
import { Share2, Youtube, Calendar, Clock, CheckCircle2, Send, Plus, ArrowUpRight, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CrossPostHubProps {
  project: VideoProject;
  channel: Channel;
  scheduledPosts: ScheduledPost[];
  onAddScheduledPost: (post: ScheduledPost) => void;
}

export const CrossPostHub: React.FC<CrossPostHubProps> = ({
  project,
  channel,
  scheduledPosts,
  onAddScheduledPost,
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    youtube: true,
    tiktok: true,
    instagram: true,
  });

  const [scheduledDateTime, setScheduledDateTime] = useState('Tomorrow, 6:30 PM (Peak US East)');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // TikTok specific metadata
  const [tiktokSound, setTiktokSound] = useState('Trending Original Audio (Synthesized)');
  const [tiktokDuetEnabled, setTiktokDuetEnabled] = useState(true);

  // Instant 1-Click Multi-Platform Publish
  const handleInstantPublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishedSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      const newPost: ScheduledPost = {
        id: 'sch-' + Math.random().toString(36).substring(2, 8),
        projectId: project.id,
        title: project.title,
        channelId: channel.id,
        platforms: (Object.keys(selectedPlatforms) as ('youtube' | 'tiktok' | 'instagram')[]).filter(
          (k) => selectedPlatforms[k]
        ),
        scheduledTime: 'Published Just Now',
        status: 'completed',
        targetHook: project.hook,
      };

      onAddScheduledPost(newPost);
      setTimeout(() => setPublishedSuccess(false), 4000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-neutral-900/60 to-pink-950/40 p-6 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
              <Share2 className="w-3 h-3 text-blue-400" />
              Omni-Platform Distribution Engine
            </span>
            <span className="text-xs text-neutral-400">
              Channel: <strong className="text-neutral-200">{channel.name}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            1-Click Multi-Platform Cross-Poster & Scheduler
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Simultaneously push your rendered short-form videos to YouTube Shorts, TikTok, and Instagram
            Reels. Automatically formats titles, tags, and sound cues tailored to each platform's algorithm.
          </p>
        </div>

        <button
          onClick={handleInstantPublish}
          disabled={isPublishing}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-neutral-950 font-bold rounded-xl text-xs transition-transform active:scale-95 shadow-xl shadow-cyan-500/20 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isPublishing ? 'Transmitting to APIs...' : 'Publish to All Platforms Now'}</span>
        </button>
      </div>

      {publishedSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-emerald-200 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold">
              Successfully distributed to YouTube Shorts, TikTok, and Instagram Reels!
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400">Status 200 OK</span>
        </div>
      )}

      {/* Cross-Posting Platforms Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* YouTube Shorts */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            selectedPlatforms.youtube
              ? 'bg-neutral-900/90 border-red-500/60 shadow-xl'
              : 'bg-neutral-900/40 border-white/5 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 font-bold text-xs">
                ▶
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">YouTube Shorts</h3>
                <span className="text-[10px] text-neutral-400 font-mono">{channel.handle}</span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={selectedPlatforms.youtube}
              onChange={(e) =>
                setSelectedPlatforms({ ...selectedPlatforms, youtube: e.target.checked })
              }
              className="w-4 h-4 accent-red-500"
            />
          </div>

          <div className="space-y-2 text-xs text-neutral-300">
            <div className="p-2 bg-neutral-950 rounded-xl border border-white/5 font-mono text-[11px]">
              <span className="text-neutral-500 block text-[9px]">Format:</span>
              <span>#Shorts in title & description</span>
            </div>
            <div className="p-2 bg-neutral-950 rounded-xl border border-white/5 font-mono text-[11px]">
              <span className="text-neutral-500 block text-[9px]">Visibility:</span>
              <span className="text-emerald-400">Public • Notify Subscribers</span>
            </div>
          </div>
        </div>

        {/* TikTok */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            selectedPlatforms.tiktok
              ? 'bg-neutral-900/90 border-pink-500/60 shadow-xl'
              : 'bg-neutral-900/40 border-white/5 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400 font-bold text-xs">
                ♪
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">TikTok Feed</h3>
                <span className="text-[10px] text-neutral-400 font-mono">@OmniCreator_Official</span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={selectedPlatforms.tiktok}
              onChange={(e) =>
                setSelectedPlatforms({ ...selectedPlatforms, tiktok: e.target.checked })
              }
              className="w-4 h-4 accent-pink-500"
            />
          </div>

          <div className="space-y-2 text-xs text-neutral-300">
            <div className="p-2 bg-neutral-950 rounded-xl border border-white/5 font-mono text-[11px]">
              <span className="text-neutral-500 block text-[9px]">Trending Audio:</span>
              <span className="text-pink-300">{tiktokSound}</span>
            </div>
            <div className="p-2 bg-neutral-950 rounded-xl border border-white/5 font-mono text-[11px] flex justify-between items-center">
              <span>Duet & Stitch:</span>
              <span className="text-emerald-400">Allowed (Viral reach)</span>
            </div>
          </div>
        </div>

        {/* Instagram Reels */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            selectedPlatforms.instagram
              ? 'bg-neutral-900/90 border-purple-500/60 shadow-xl'
              : 'bg-neutral-900/40 border-white/5 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-xs">
                📷
              </div>
              <div>
                <h3 className="font-bold text-xs text-white">Instagram Reels</h3>
                <span className="text-[10px] text-neutral-400 font-mono">@omni_media_hq</span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={selectedPlatforms.instagram}
              onChange={(e) =>
                setSelectedPlatforms({ ...selectedPlatforms, instagram: e.target.checked })
              }
              className="w-4 h-4 accent-purple-500"
            />
          </div>

          <div className="space-y-2 text-xs text-neutral-300">
            <div className="p-2 bg-neutral-950 rounded-xl border border-white/5 font-mono text-[11px]">
              <span className="text-neutral-500 block text-[9px]">Share Placement:</span>
              <span>Reels Tab & Main Grid</span>
            </div>
            <div className="p-2 bg-neutral-950 rounded-xl border border-white/5 font-mono text-[11px]">
              <span className="text-neutral-500 block text-[9px]">Hashtags Format:</span>
              <span className="text-purple-300">First Comment Strategy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Publishing Schedule Queue & Heatmap */}
      <div className="bg-neutral-900/70 p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Multi-Platform Publishing Schedule Queue</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Optimal upload time auto-calculated by analyzing your channel’s active audience hours.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-neutral-300">Peak Engagement Window:</span>
            <strong className="text-amber-400 font-mono">6:00 PM – 8:30 PM EST</strong>
          </div>
        </div>

        {/* Scheduled Posts Table */}
        <div className="space-y-3">
          {scheduledPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-neutral-950/70 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">{post.title}</h4>
                <p className="text-neutral-400 text-xs italic">Hook: "{post.targetHook}"</p>
                <div className="flex items-center gap-2 pt-1">
                  {post.platforms.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded bg-neutral-900 border border-white/10 text-[10px] font-mono capitalize text-neutral-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-neutral-300 font-mono block">{post.scheduledTime}</span>
                  <span
                    className={`text-[10px] font-bold uppercase font-mono ${
                      post.status === 'completed' ? 'text-emerald-400' : 'text-cyan-400'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
