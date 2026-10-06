import React, { useState } from 'react';
import { Channel, VideoProject, TimelineScene } from '../../types';
import { CAPTION_STYLES } from '../../data/mockData';
import { Sparkles, Bot, Film, Wand2, X, Loader2, ArrowRight } from 'lucide-react';

interface NewProjectModalProps {
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (project: VideoProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  channel,
  isOpen,
  onClose,
  onCreated,
}) => {
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('Ambitious Creators & Tech Enthusiasts');
  const [tone, setTone] = useState('High-Energy & Viral Disruption');
  const [visualModel, setVisualModel] = useState<'Flux Pro 1.1' | 'Gemini 3.8 Visual' | 'Imagen 3' | 'Veo 3.1'>('Flux Pro 1.1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsGenerating(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/ai/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          channelNiche: channel.niche,
          targetAudience,
          tone,
          durationSeconds: 58,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script via backend');
      }

      const data = await response.json();

      const scenes: TimelineScene[] = (data.scenes || []).map((sc: any, idx: number) => ({
        id: sc.id || `sc-${idx + 1}`,
        title: `Scene ${idx + 1}: ${sc.caption ? sc.caption.substring(0, 20) : 'Point ' + (idx + 1)}`,
        start: sc.start || idx * 10,
        duration: sc.duration || 10,
        narration: sc.narration || '',
        bRollPrompt: sc.bRollPrompt || 'Cinematic 8k visual scene',
        bRollImageUrl:
          idx % 2 === 0
            ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
        caption: sc.caption || sc.narration || 'KEY INSIGHT 🚀',
        sfx: sc.sfx || 'Sub Bass Drop',
        avatarEmotion: sc.avatarEmotion || 'confident',
        cameraZoom: sc.cameraZoom || '1.15x push-in',
        visualModel,
      }));

      const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0) || 58;

      const newProject: VideoProject = {
        id: 'proj-' + Math.random().toString(36).substring(2, 9),
        title: data.title || topic,
        channelId: channel.id,
        aspectRatio: '9:16',
        durationSeconds: totalDuration,
        hook: data.hook || 'Here is what nobody is telling you about this...',
        scenes,
        captionStyle: CAPTION_STYLES[0],
        tags: data.tags || ['#shorts', '#viralhacks', '#growth'],
        searchVolumeRank: data.searchVolumeRank || 92,
        avatarOverlay: {
          enabled: true,
          avatarId: channel.defaultAvatarId,
          position: 'bottom-right',
          scale: 0.85,
          showCutout: true,
          lipSyncSyncRate: 99.8,
        },
        voiceConfig: {
          voiceId: channel.defaultVoiceId,
          isCustomClone: true,
          pitch: 1.0,
          cadence: 1.15,
        },
        thumbnail: {
          textOverlay: data.title ? data.title.toUpperCase().substring(0, 28) : 'DO THIS INSTEAD! 🚨',
          avatarReaction: 'Shocked / Jaw-drop pointing at key metric',
          primaryBgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          accentColor: '#facc15',
        },
        status: 'ready',
      };

      onCreated(newProject);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error communicating with AI Script Agent');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                AI Generation Agent: Script & Timeline Pipeline
              </h3>
              <p className="text-xs text-neutral-400">
                Crafts high-retention 60s short-form scripts, B-roll prompts, and captions for{' '}
                <strong className="text-neutral-200">{channel.name}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleGenerateScript} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Video Topic or Angle Idea
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Why 99% of people quit coding before their first $1,000"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-neutral-100 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Viral Tone Strategy
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="High-Energy & Viral Disruption">High-Energy & Viral Disruption</option>
                <option value="Curiosity Gap & Shocking Truth">Curiosity Gap & Shocking Truth</option>
                <option value="No-BS Executive Breakdown">No-BS Executive Breakdown</option>
                <option value="Fast Storytelling with Loop Hook">Fast Storytelling with Loop Hook</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Visual Inference Engine
              </label>
              <select
                value={visualModel}
                onChange={(e) => setVisualModel(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="Flux Pro 1.1">Flux Pro 1.1 (Photorealism)</option>
                <option value="Gemini 3.8 Visual">Gemini 3.8 Visual</option>
                <option value="Imagen 3">Google Imagen 3</option>
                <option value="Veo 3.1">Veo 3.1 (Cinematic Video)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Target Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">
              ⚡ Includes Lip-Synced Avatar + Custom Voice Clone
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-neutral-950 font-bold rounded-xl text-xs transition-transform active:scale-95 shadow-xl shadow-cyan-500/20 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Orchestrating Script & Scenes...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Complete Video</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
