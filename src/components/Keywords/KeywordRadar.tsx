import React, { useState } from 'react';
import { TrendingTopic, Channel } from '../../types';
import { Flame, Search, ArrowUpRight, Sparkles, Filter, RefreshCw, BarChart2, Zap } from 'lucide-react';

interface KeywordRadarProps {
  trends: TrendingTopic[];
  activeChannel: Channel;
  onLaunchTopicProject: (topic: TrendingTopic) => void;
  onRefreshTrends: () => void;
  isRefreshing: boolean;
}

export const KeywordRadar: React.FC<KeywordRadarProps> = ({
  trends,
  activeChannel,
  onLaunchTopicProject,
  onRefreshTrends,
  isRefreshing,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [competitionFilter, setCompetitionFilter] = useState<string>('all');

  const filteredTrends = trends.filter((t) => {
    const matchesSearch =
      t.keyword.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.viralHookTemplate.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesComp =
      competitionFilter === 'all' || t.competition.toLowerCase() === competitionFilter.toLowerCase();
    return matchesSearch && matchesComp;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-950/40 via-neutral-900/60 to-blue-950/40 p-6 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              Live Breakout Radar
            </span>
            <span className="text-xs text-neutral-400">
              Target Channel: <strong className="text-neutral-200">{activeChannel.name}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            High-Ranked Keywords & Viral Topic Velocity
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Real-time search volume, breakout acceleration velocity, competition difficulty scores,
            and pre-tested viral hook formulas designed for YouTube Shorts and TikTok feeds.
          </p>
        </div>

        <button
          onClick={onRefreshTrends}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Analyzing Feed...' : 'Scan New Breakout Trends'}</span>
        </button>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords or viral hooks..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Competition:
          </span>
          <select
            value={competitionFilter}
            onChange={(e) => setCompetitionFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-neutral-200 focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="low">Low Competition (Fastest Ranking)</option>
            <option value="medium">Medium Competition</option>
            <option value="high">High Competition</option>
          </select>
        </div>
      </div>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrends.map((trend) => (
          <div
            key={trend.id}
            className="p-5 rounded-2xl bg-neutral-900/70 border border-white/5 hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-cyan-500/5 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">
                    {trend.niche}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                    {trend.keyword}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 block">
                    {trend.velocity}
                  </span>
                  <span className="text-[9px] text-neutral-500 mt-0.5 block">Search Velocity</span>
                </div>
              </div>

              {/* Metrics pill row */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-neutral-950/80 rounded-xl border border-white/5 text-center my-3">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Est. Volume</span>
                  <span className="text-xs font-bold font-mono text-neutral-200">
                    {trend.searchVolume}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Competition</span>
                  <span
                    className={`text-xs font-bold font-mono ${
                      trend.competition === 'Low'
                        ? 'text-emerald-400'
                        : trend.competition === 'Medium'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {trend.competition} ({trend.difficultyScore}/100)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">CTR Potential</span>
                  <span className="text-xs font-bold font-mono text-cyan-400">
                    {trend.ctrPotential}
                  </span>
                </div>
              </div>

              {/* Proven viral hook template */}
              <div className="p-3 bg-neutral-950/50 rounded-xl border border-amber-500/20 text-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 font-bold block mb-1">
                  ⚡ Pre-Tested Hook Formula:
                </span>
                <p className="text-neutral-300 italic font-medium">"{trend.viralHookTemplate}"</p>
              </div>
            </div>

            {/* Launch project action */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 font-mono">
                Format: <strong className="text-neutral-200">{trend.bestFormat}</strong>
              </span>

              <button
                onClick={() => onLaunchTopicProject(trend)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-neutral-950 border border-cyan-500/40 rounded-xl text-xs font-bold transition-all shadow-md group-hover:scale-[1.02]"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click Generate Video</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
