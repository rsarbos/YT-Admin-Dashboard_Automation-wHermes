import React, { useState } from 'react';
import { VideoProject, Channel, AvatarProfile } from '../../types';
import { RealVideoExporter } from '../../utils/videoExporter';
import { Sparkles, Copy, Check, Eye, Smartphone, RefreshCw, Palette, Layers, Award, Download } from 'lucide-react';

interface ThumbnailStudioProps {
  project: VideoProject;
  channel: Channel;
  activeAvatar: AvatarProfile;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
}

export const ThumbnailStudio: React.FC<ThumbnailStudioProps> = ({
  project,
  channel,
  activeAvatar,
  onUpdateProject,
}) => {
  const [copiedTags, setCopiedTags] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeVariant, setActiveVariant] = useState<'A' | 'B' | 'C'>('A');

  const thumbnailVariants = {
    A: {
      text: project.thumbnail.textOverlay || 'STOP DOING THIS! 🚨',
      bg: project.thumbnail.primaryBgUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      color: '#facc15',
      ctrScore: '18.4% High CTR',
    },
    B: {
      text: 'THE 10X SECRET REVEALED ⚡',
      bg: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
      color: '#38bdf8',
      ctrScore: '15.9% Strong CTR',
    },
    C: {
      text: 'WHY 99% FAIL IN 2026 😱',
      bg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      color: '#f43f5e',
      ctrScore: '14.2% Good CTR',
    },
  };

  const currentVariantData = thumbnailVariants[activeVariant];

  const handleCopyTags = () => {
    navigator.clipboard.writeText(project.tags.join(' '));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleDownloadThumbnail = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await RealVideoExporter.exportThumbnail(
        currentVariantData.text,
        activeAvatar.imageUrl,
        currentVariantData.bg,
        currentVariantData.color
      );
      if (dataUrl) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `thumbnail_${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 20)}.png`;
        a.click();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRegenerateThumbnails = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      onUpdateProject({
        thumbnail: {
          ...project.thumbnail,
          textOverlay: 'DO THIS INSTEAD! 🔥',
        },
        tags: [
          '#shorts',
          '#viralhacks',
          '#youtubegrowth',
          '#algorithmsecret',
          '#retentionrate',
          '#aitools',
          '#contentcreation',
        ],
        searchVolumeRank: 98,
      });
      setIsGeneratingAI(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-neutral-900/60 to-orange-950/40 p-6 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              High-CTR Thumbnail & Metadata Engine
            </span>
            <span className="text-xs text-neutral-400">
              Channel: <strong className="text-neutral-200">{channel.name}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Automated High-CTR Thumbnails, Tags & SEO Ranker
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Automatically generates click-worthy thumbnail designs with psychological contrast hooks,
            avatar reaction cutouts, high-ranked YouTube search tags, and live mobile feed preview.
          </p>
        </div>

        <button
          onClick={handleRegenerateThumbnails}
          disabled={isGeneratingAI}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
          <span>{isGeneratingAI ? 'Synthesizing...' : 'Re-Generate Variations'}</span>
        </button>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Thumbnail Stage & A/B Variants (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-neutral-900/70 p-5 rounded-2xl border border-white/5 space-y-4">
            {/* Variant Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                A/B/C Test Variations
              </span>
              <div className="flex gap-2">
                {(['A', 'B', 'C'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setActiveVariant(v)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                      activeVariant === v
                        ? 'bg-amber-500 text-neutral-950 shadow-md'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Variant {v} ({thumbnailVariants[v].ctrScore.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail Canvas Preview (9:16 vertical Short thumbnail) */}
            <div className="relative mx-auto w-[280px] h-[497px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              {/* Background Art */}
              <img
                src={currentVariantData.bg}
                alt="Thumbnail Background"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Gradient Vignette for Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/80" />

              {/* Avatar Reaction Cutout in lower area */}
              <div className="absolute bottom-4 right-2 w-32 h-44 pointer-events-none">
                <img
                  src={activeAvatar.imageUrl}
                  alt={activeAvatar.name}
                  className="w-full h-full object-cover rounded-xl border border-white/20 shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.4))',
                  }}
                />
              </div>

              {/* High-Contrast Bold Typography Overlay */}
              <div className="absolute top-10 left-4 right-4 text-center">
                <h1
                  className="text-2xl font-black uppercase tracking-tight leading-tight"
                  style={{
                    color: currentVariantData.color,
                    textShadow: '0 4px 15px rgba(0,0,0,0.95), 0 0 25px rgba(0,0,0,0.8)',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {currentVariantData.text}
                </h1>

                {/* Subtitle hook pill */}
                <span className="inline-block mt-2 px-3 py-1 rounded-md bg-black/80 backdrop-blur-md text-white font-mono text-[10px] uppercase font-bold border border-white/20">
                  {project.title.substring(0, 36)}...
                </span>
              </div>

              {/* Floating CTR Prediction Badge */}
              <div className="absolute bottom-4 left-4 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-lg">
                🔥 {currentVariantData.ctrScore}
              </div>
            </div>

            {/* Custom Text Overlay Input & Download */}
            <div className="p-3 bg-neutral-950/80 rounded-xl border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-neutral-400 block uppercase tracking-wider">
                  Custom Thumbnail Overlay Text
                </label>
                <button
                  onClick={handleDownloadThumbnail}
                  disabled={isDownloading}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloading ? 'Rendering PNG...' : 'Download Thumbnail (PNG)'}</span>
                </button>
              </div>
              <input
                type="text"
                value={project.thumbnail.textOverlay}
                onChange={(e) =>
                  onUpdateProject({
                    thumbnail: {
                      ...project.thumbnail,
                      textOverlay: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Mobile Shorts Feed Simulator & SEO Tags (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* YouTube Mobile Feed Simulator */}
          <div className="bg-neutral-900/70 p-5 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>YouTube Mobile Shorts Shelf Simulator</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">1080x1920 Display</span>
            </div>

            {/* Simulated feed card */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 flex gap-3 items-center">
              <div className="w-16 h-28 rounded-lg overflow-hidden shrink-0 relative border border-white/10">
                <img
                  src={currentVariantData.bg}
                  alt="Thumb"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <span className="absolute bottom-1 left-1 text-[8px] font-black text-amber-300 leading-none">
                  {currentVariantData.text.substring(0, 15)}...
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-red-500 font-bold uppercase font-mono block">
                  Shorts Feed
                </span>
                <h4 className="text-xs font-bold text-white truncate mt-0.5">
                  {project.title}
                </h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  {channel.name} • 142K views • 2 hours ago
                </p>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-mono">
                  <Eye className="w-3 h-3" />
                  <span>Thumb Visibility: Extreme</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic SEO Tags & Keywords */}
          <div className="bg-neutral-900/70 p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-200 block">
                  High-Ranked SEO Tags
                </span>
                <span className="text-[10px] text-neutral-400">
                  Search Volume Score: <strong className="text-cyan-400 font-mono">{project.searchVolumeRank}/100</strong>
                </span>
              </div>

              <button
                onClick={handleCopyTags}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-neutral-200 rounded-lg text-xs font-semibold border border-white/10 transition-colors"
              >
                {copiedTags ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 bg-neutral-950 rounded-xl border border-white/5">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded bg-neutral-900 border border-white/10 text-cyan-300 font-mono text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
