import React from 'react';
import { Channel, VideoProject } from '../../types';
import { Youtube, Plus, Zap, Download, ChevronDown, Check, Play, Film, Bot } from 'lucide-react';

interface HeaderProps {
  channels: Channel[];
  activeChannel: Channel;
  project: VideoProject;
  onSelectChannel: (channelId: string) => void;
  onOpenNewModal: () => void;
  onTriggerExport: () => void;
  onOpenAutonomousAgent?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  channels,
  activeChannel,
  project,
  onSelectChannel,
  onOpenNewModal,
  onTriggerExport,
  onOpenAutonomousAgent,
}) => {
  const [channelDropdownOpen, setChannelDropdownOpen] = React.useState(false);

  return (
    <header className="h-16 bg-[#0c0d14]/90 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between z-40 select-none">
      {/* Brand logo & active project title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-base">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
              <span>OmniTube AI</span>
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Studio Pro
              </span>
            </h1>
            <p className="text-[10px] text-neutral-400 font-mono truncate max-w-[200px] sm:max-w-[320px]">
              {project.title}
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Multi-Channel Switcher Dropdown */}
      <div className="relative">
        <button
          onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-white/10 hover:border-white/20 text-xs transition-colors shadow-sm"
        >
          <img
            src={activeChannel.avatarUrl}
            alt={activeChannel.name}
            className="w-5 h-5 rounded-lg object-cover"
          />
          <div className="text-left">
            <span className="font-bold text-neutral-200 block leading-tight">
              {activeChannel.name}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono block">
              {activeChannel.handle}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-1" />
        </button>

        {channelDropdownOpen && (
          <div className="absolute top-full mt-2 left-0 w-64 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 px-2 py-1 block uppercase">
              Switch Channel Portfolio
            </span>
            {channels.map((chan) => {
              const isSelected = chan.id === activeChannel.id;
              return (
                <button
                  key={chan.id}
                  onClick={() => {
                    onSelectChannel(chan.id);
                    setChannelDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-neutral-800 text-white'
                      : 'hover:bg-neutral-800/50 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={chan.avatarUrl}
                      alt={chan.name}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <div>
                      <strong className="block leading-tight">{chan.name}</strong>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {chan.niche}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Autonomous Agent Button */}
        {onOpenAutonomousAgent && (
          <button
            onClick={onOpenAutonomousAgent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-md shadow-amber-950/20"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Agente Autónomo</span>
          </button>
        )}

        {/* Cloud GPU telemetry status badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-900 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Cloud GPU 18.4x</span>
        </div>

        {/* New AI Short button */}
        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10 text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New AI Short</span>
        </button>

        {/* Export / Cloud GPU render */}
        <button
          onClick={onTriggerExport}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-neutral-950 font-bold rounded-xl text-xs transition-transform active:scale-95 shadow-md shadow-cyan-500/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export 4K/Short</span>
        </button>
      </div>
    </header>
  );
};
