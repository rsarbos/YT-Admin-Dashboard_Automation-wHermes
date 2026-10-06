import React, { useState } from 'react';
import { CompetitorBenchmark as CompetitorType, Channel } from '../../types';
import { Target, Zap, Scissors, BarChart3, TrendingUp, Sparkles, Check, ArrowRight } from 'lucide-react';

interface CompetitorBenchmarkProps {
  competitors: CompetitorType[];
  activeChannel: Channel;
  onApplyStrategy: (competitor: CompetitorType) => void;
}

export const CompetitorBenchmark: React.FC<CompetitorBenchmarkProps> = ({
  competitors,
  activeChannel,
  onApplyStrategy,
}) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorType>(competitors[0]);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const handleApply = (comp: CompetitorType) => {
    onApplyStrategy(comp);
    setAppliedNotification(comp.creatorName);
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-950/40 via-neutral-900/60 to-amber-950/40 p-6 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3 text-rose-400" />
              Creator Reverse-Engineering Engine
            </span>
            <span className="text-xs text-neutral-400">
              Active Channel: <strong className="text-neutral-200">{activeChannel.name}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Top Industry Creators Benchmark & Hook Dissector
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Dissect pacing algorithms, visual cut frequency, curiosity loop structures, and caption
            typographies used by the top 0.1% short-form creators worldwide. Convert their winning formulas
            directly into your active scripts.
          </p>
        </div>

        {appliedNotification && (
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold animate-bounce">
            <Check className="w-4 h-4" />
            <span>Applied {appliedNotification}'s formula to editor!</span>
          </div>
        )}
      </div>

      {/* Competitor Cards Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {competitors.map((comp) => {
          const isSelected = selectedCompetitor.id === comp.id;
          return (
            <div
              key={comp.id}
              onClick={() => setSelectedCompetitor(comp)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-neutral-900/90 border-rose-500/80 shadow-xl ring-1 ring-rose-500/50'
                  : 'bg-neutral-900/50 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={comp.avatarUrl}
                  alt={comp.creatorName}
                  className="w-11 h-11 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <h3 className="font-bold text-xs text-white truncate">{comp.creatorName}</h3>
                  <span className="text-[11px] text-neutral-400 font-mono">{comp.handle}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2 bg-neutral-950/70 rounded-xl border border-white/5 text-center text-xs mb-3">
                <div>
                  <span className="text-[9px] text-neutral-500 block">Subscribers</span>
                  <span className="font-bold text-neutral-200 font-mono">{comp.subscribers}</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-500 block">Avg Views/Short</span>
                  <span className="font-bold text-rose-400 font-mono">{comp.avgShortViews}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-neutral-300 font-mono">
                <Scissors className="w-3 h-3 text-cyan-400" />
                <span>Pace: {comp.cutPace}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Creator Deep-Dive Breakdown */}
      <div className="bg-neutral-900/70 p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            <img
              src={selectedCompetitor.avatarUrl}
              alt={selectedCompetitor.creatorName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-500/40"
            />
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{selectedCompetitor.creatorName}</span>
                <span className="text-xs font-mono text-neutral-400 font-normal">
                  ({selectedCompetitor.handle})
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Audience: {selectedCompetitor.subscribers} Subscribers • {selectedCompetitor.avgShortViews} Avg Short Views
              </p>
            </div>
          </div>

          <button
            onClick={() => handleApply(selectedCompetitor)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-rose-500/20"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Apply Formula to My Active Video Script</span>
          </button>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hook Pattern */}
          <div className="p-4 bg-neutral-950/70 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Signature Opening Hook Formula</span>
            </div>
            <p className="text-sm font-semibold text-white italic">
              {selectedCompetitor.topHookFormula}
            </p>
            <p className="text-xs text-neutral-400 pt-1">
              Forces viewers to stop scrolling by targeting an immediate fear of missing out or loss aversion.
            </p>
          </div>

          {/* Retention Technique */}
          <div className="p-4 bg-neutral-950/70 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Audience Retention & Loop Mechanism</span>
            </div>
            <p className="text-xs text-neutral-200 font-medium">
              {selectedCompetitor.retentionTechnique}
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-neutral-400">
              <Scissors className="w-3.5 h-3.5 text-rose-400" />
              <span>Cutting Rhythm: <strong>{selectedCompetitor.cutPace}</strong></span>
            </div>
          </div>

          {/* Caption & Visual Style */}
          <div className="p-4 bg-neutral-950/70 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" />
              <span>Kinetic Typography & Visual Grading</span>
            </div>
            <p className="text-xs text-neutral-300">
              {selectedCompetitor.captionStyle}
            </p>
          </div>

          {/* Actionable Strategy Takeaway */}
          <div className="p-4 bg-neutral-950/70 rounded-xl border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Check className="w-4 h-4" />
              <span>Actionable Rule for Your Channel</span>
            </div>
            <p className="text-xs text-neutral-200 font-medium leading-relaxed">
              {selectedCompetitor.actionableTakeaway}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
