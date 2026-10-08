import React, { useState } from 'react';
import { Channel } from '../../types';
import { SUGGESTED_CHANNEL_TEMPLATES } from '../../data/mockData';
import { Youtube, Plus, ExternalLink, CheckCircle2, Sliders, Palette, ArrowRight, Sparkles, Check, Bot } from 'lucide-react';

interface ChannelManagerProps {
  channels: Channel[];
  activeChannelId: string;
  onSelectChannel: (channelId: string) => void;
  onAddChannel: (channel: Channel) => void;
  onUpdateChannel: (channel: Channel) => void;
  onProceedToNextStep?: () => void;
  onOpenAutonomousAgent?: () => void;
}

export const ChannelManager: React.FC<ChannelManagerProps> = ({
  channels,
  activeChannelId,
  onSelectChannel,
  onAddChannel,
  onUpdateChannel,
  onProceedToNextStep,
  onOpenAutonomousAgent,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelHandle, setNewChannelHandle] = useState('');
  const [newChannelNiche, setNewChannelNiche] = useState('');
  const [newChannelColor, setNewChannelColor] = useState('#06b6d4');

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  const handleApplyTemplate = (tmpl: typeof SUGGESTED_CHANNEL_TEMPLATES[0]) => {
    onUpdateChannel({
      ...activeChannel,
      name: tmpl.name,
      handle: tmpl.handle,
      niche: tmpl.niche,
      primaryColor: tmpl.color,
      brandFont: tmpl.font,
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName) return;

    const newChan: Channel = {
      id: 'ch-' + Math.random().toString(36).substring(2, 8),
      name: newChannelName,
      handle: newChannelHandle.startsWith('@') ? newChannelHandle : `@${newChannelHandle || newChannelName.toLowerCase().replace(/\s+/g, '')}`,
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      niche: newChannelNiche || 'General Short-Form',
      primaryColor: newChannelColor,
      brandFont: 'Plus Jakarta Sans',
      defaultAvatarId: 'avatar-user-twin',
      defaultVoiceId: 'voice-user-clone',
      status: 'active',
      connectedPlatforms: {
        youtube: true,
        tiktok: false,
        instagram: false,
      },
      metrics: {
        targetDuration: '58s Short',
        shortsCount: 0,
        targetPacingWpm: 150,
        voiceStatus: 'Voice Ready',
        avatarStatus: 'Ready for Photo',
      },
    };

    onAddChannel(newChan);
    onSelectChannel(newChan.id);
    setShowAddModal(false);
    setNewChannelName('');
    setNewChannelHandle('');
    setNewChannelNiche('');
  };

  return (
    <div className="space-y-6">
      {/* Guided Step 1 Banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-neutral-900/70 to-cyan-950/40 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
              Step 1: Channel Profile Setup
            </span>
            <span className="text-xs text-neutral-400">
              Active Channel: <strong className="text-white">{activeChannel.name}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Set Your Channel Brand & Target Niche
          </h2>
          <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
            Configure your actual YouTube channel details or select one of our high-performing niche templates
            below to pre-fill content strategy settings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenAutonomousAgent && (
            <button
              onClick={onOpenAutonomousAgent}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-bold border border-amber-500/40 transition-colors shadow-md shadow-amber-950/20"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Ejecutar Agente Autónomo</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Channel</span>
          </button>

          {onProceedToNextStep && (
            <button
              onClick={onProceedToNextStep}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
            >
              <span>Confirm & Continue to Digital Twin Photo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Channel Niche Presets */}
      <div className="p-5 bg-neutral-900/60 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Suggested Niche Presets (Click to Apply)
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">
            Optimized for Shorts retention
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SUGGESTED_CHANNEL_TEMPLATES.map((tmpl, idx) => (
            <div
              key={idx}
              onClick={() => handleApplyTemplate(tmpl)}
              className="p-4 rounded-xl bg-neutral-950/80 border border-white/5 hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-neutral-900/90 group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                  {tmpl.name}
                </span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tmpl.color }} />
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed mb-2">
                {tmpl.description}
              </p>
              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono pt-2 border-t border-white/5">
                <span>{tmpl.handle}</span>
                <span className="text-cyan-400 font-semibold group-hover:underline">Use Preset</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Channel Configuration & Real Production Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Channel Form (2 cols) */}
        <div className="lg:col-span-2 bg-neutral-900/60 p-6 rounded-2xl border border-white/5 space-y-5">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-500" />
              <span>Channel Identity & Upload Defaults</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Edit your channel name, handle, and niche category.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Channel Name
              </label>
              <input
                type="text"
                value={activeChannel.name}
                onChange={(e) => onUpdateChannel({ ...activeChannel, name: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-neutral-100 text-xs focus:outline-none focus:border-cyan-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                YouTube Handle
              </label>
              <input
                type="text"
                value={activeChannel.handle}
                onChange={(e) => onUpdateChannel({ ...activeChannel, handle: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Core Niche & Focus Area
              </label>
              <input
                type="text"
                value={activeChannel.niche}
                onChange={(e) => onUpdateChannel({ ...activeChannel, niche: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Social Platforms Sync */}
          <div className="pt-2 border-t border-white/5">
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Connected Platforms for Multi-Platform Distribution
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-xl border border-white/5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeChannel.connectedPlatforms.youtube}
                  onChange={(e) =>
                    onUpdateChannel({
                      ...activeChannel,
                      connectedPlatforms: {
                        ...activeChannel.connectedPlatforms,
                        youtube: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-red-500"
                />
                <span className="font-semibold text-red-400">YouTube Shorts</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-xl border border-white/5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeChannel.connectedPlatforms.tiktok}
                  onChange={(e) =>
                    onUpdateChannel({
                      ...activeChannel,
                      connectedPlatforms: {
                        ...activeChannel.connectedPlatforms,
                        tiktok: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-pink-500"
                />
                <span className="font-semibold text-pink-400">TikTok Feed</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-xl border border-white/5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeChannel.connectedPlatforms.instagram}
                  onChange={(e) =>
                    onUpdateChannel({
                      ...activeChannel,
                      connectedPlatforms: {
                        ...activeChannel.connectedPlatforms,
                        instagram: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-purple-500"
                />
                <span className="font-semibold text-purple-400">Instagram Reels</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Real Production Parameters & AI Brand Assets (1 col) */}
        <div className="bg-neutral-900/60 p-6 rounded-2xl border border-white/5 space-y-5">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Channel AI Brand Assets</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Color accents and typography applied to all shorts.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Brand Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={activeChannel.primaryColor}
                onChange={(e) => onUpdateChannel({ ...activeChannel, primaryColor: e.target.value })}
                className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-white/20"
              />
              <span className="font-mono text-xs text-neutral-200">{activeChannel.primaryColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Caption Typography Style
            </label>
            <select
              value={activeChannel.brandFont}
              onChange={(e) => onUpdateChannel({ ...activeChannel, brandFont: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
              <option value="Montserrat">Montserrat (Heavy Punch / Hormozi)</option>
              <option value="Cabinet Grotesk">Cabinet Grotesk (Bold Editorial)</option>
              <option value="JetBrains Mono">JetBrains Mono (Coding & Tech)</option>
            </select>
          </div>

          {/* Real Target Parameters */}
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-white/5 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-neutral-300 block uppercase tracking-wider">
              Short-Form Retention Targets
            </span>
            <div className="flex justify-between text-neutral-400">
              <span>Target Duration:</span>
              <span className="text-white font-mono font-bold">55–58 seconds</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Pacing Cadence:</span>
              <span className="text-cyan-400 font-mono font-bold">145–160 WPM</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Audience APV Benchmark:</span>
              <span className="text-emerald-400 font-mono font-bold">&gt;85% for feed breakout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Channel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Channel to Portfolio</h3>
            <p className="text-xs text-neutral-400">
              Configure a dedicated channel profile for short-form automation.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Channel Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Hustle Lab"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-neutral-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  YouTube Handle
                </label>
                <input
                  type="text"
                  placeholder="@AIHustleLab"
                  value={newChannelHandle}
                  onChange={(e) => setNewChannelHandle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-neutral-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Niche / Core Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI Tools, SaaS, Automation"
                  value={newChannelNiche}
                  onChange={(e) => setNewChannelNiche(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-neutral-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-cyan-500/20"
                >
                  Create Channel Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
