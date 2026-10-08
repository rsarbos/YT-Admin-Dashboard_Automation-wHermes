import React from 'react';
import { NavigationTab } from '../../types';
import {
  Bot,
  Film,
  Youtube,
  TrendingUp,
  Target,
  UserCheck,
  Award,
  Share2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export type { NavigationTab };

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    {
      id: 'autonomous-agent',
      label: 'YouTube Studio AI Agent',
      sub: 'Multi-Channel Auto-Pilot',
      icon: Bot,
      color: 'text-amber-400',
      badge: 'AUTO',
    },
    {
      id: 'editor',
      label: 'AI Video Editor',
      sub: 'Drag & Drop Canvas',
      icon: Film,
      color: 'text-cyan-400',
    },
    {
      id: 'channels',
      label: 'Channels Network',
      sub: 'Multi-Channel Hub',
      icon: Youtube,
      color: 'text-red-400',
    },
    {
      id: 'keywords',
      label: 'Ranked Keywords',
      sub: 'Breakout Topic Radar',
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
    {
      id: 'competitors',
      label: 'Competitors Benchmark',
      sub: 'Viral Hook Dissector',
      icon: Target,
      color: 'text-rose-400',
    },
    {
      id: 'avatar',
      label: 'Digital Twin & Voice',
      sub: 'Realistic Avatar & Clone',
      icon: UserCheck,
      color: 'text-purple-400',
    },
    {
      id: 'thumbnails',
      label: 'Thumbnails & SEO',
      sub: 'High-CTR Visuals',
      icon: Award,
      color: 'text-amber-400',
    },
    {
      id: 'distribution',
      label: 'Cross-Post Hub',
      sub: 'Shorts, TikTok, Reels',
      icon: Share2,
      color: 'text-blue-400',
    },
    {
      id: 'cloudgpu',
      label: 'Cloud GPU Cluster',
      sub: 'Fast Distributed Export',
      icon: Cpu,
      color: 'text-teal-400',
    },
  ];

  return (
    <aside className="w-64 bg-[#0a0b12] border-r border-white/5 flex flex-col justify-between p-3 select-none shrink-0">
      <div className="space-y-1">
        <span className="text-[10px] font-mono text-neutral-500 uppercase px-3 py-2 block tracking-wider">
          Studio Navigation
        </span>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavigationTab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-neutral-800/90 text-white font-bold border border-white/10 shadow-lg shadow-black/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-neutral-700/60' : 'bg-neutral-900'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? item.color : 'text-neutral-400'}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs block leading-tight truncate">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-neutral-500 block leading-tight font-normal truncate">
                  {item.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom AI Status widget */}
      <div className="p-3 bg-neutral-900/60 rounded-2xl border border-white/5 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-neutral-400">AI Model Pipeline</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Online
          </span>
        </div>
        <div className="text-[10px] text-neutral-400 space-y-0.5">
          <p>• Script: Gemini 3.8 Flash</p>
          <p>• Visual: Multi-Model (Flux / Veo)</p>
          <p>• Voice: Cloned Twin 60fps</p>
        </div>
      </div>
    </aside>
  );
};
