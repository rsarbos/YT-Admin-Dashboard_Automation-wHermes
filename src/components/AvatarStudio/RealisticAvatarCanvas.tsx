import React from 'react';
import { VisemeState } from '../../utils/audioLipSync';
import { AvatarProfile } from '../../types';

interface RealisticAvatarCanvasProps {
  avatar: AvatarProfile;
  viseme: VisemeState;
  isSpeaking: boolean;
  className?: string;
  showCutout?: boolean;
  compact?: boolean;
}

export const RealisticAvatarCanvas: React.FC<RealisticAvatarCanvasProps> = ({
  avatar,
  viseme,
  isSpeaking,
  className = '',
  showCutout = false,
  compact = false,
}) => {
  // Background gradient based on avatar lighting preset
  const getLightingStyle = () => {
    switch (avatar.lightingPreset) {
      case 'Cyber RGB Studio':
        return 'from-cyan-900/40 via-purple-950/40 to-neutral-950 border-cyan-500/30';
      case 'Softbox Warm Studio':
        return 'from-amber-900/30 via-orange-950/30 to-neutral-950 border-amber-500/30';
      case 'Moody Dark Executive':
        return 'from-zinc-800/40 via-neutral-900/60 to-black border-zinc-700/40';
      case 'High-Key White':
        return 'from-slate-700/30 via-neutral-900/60 to-black border-slate-500/40';
      default:
        return 'from-cyan-950/40 to-neutral-950 border-cyan-500/30';
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl select-none ${
        showCutout ? 'bg-transparent' : `bg-gradient-to-b ${getLightingStyle()} border`
      } ${className}`}
      style={{
        transform: `rotate(${viseme.headTilt}deg)`,
        transition: 'transform 0.08s ease-out',
      }}
    >
      {/* Studio rim lighting glows */}
      {!showCutout && (
        <>
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        </>
      )}

      {/* Main Avatar Character Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={avatar.imageUrl}
          alt={avatar.name}
          className={`w-full h-full object-cover pointer-events-none transition-transform duration-100 ${
            isSpeaking ? 'scale-[1.01]' : 'scale-100'
          }`}
          style={{
            filter: showCutout ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.8))' : 'none',
          }}
        />

        {/* Dynamic Lip-Sync Mouth Overlay */}
        {/* We place a realistic synthesized phonetic mouth overlay precisely over the mouth region */}
        <div
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            bottom: '26%',
            left: '50%',
            transform: `translateX(-50%) translateY(${viseme.jawOffset * 0.4}px)`,
            width: `${40 * viseme.mouthWidth}px`,
            height: `${Math.max(4, 22 * viseme.mouthOpen)}px`,
            transition: 'all 0.05s ease-out',
          }}
        >
          {isSpeaking && viseme.mouthOpen > 0.08 && (
            <div
              className="w-full h-full rounded-full bg-neutral-900/95 border border-rose-900/60 shadow-inner flex flex-col items-center justify-center overflow-hidden"
              style={{
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.95), 0 1px 3px rgba(244,63,94,0.3)',
              }}
            >
              {/* Upper teeth hint */}
              <div
                className="w-4/5 h-[3px] bg-rose-50/90 rounded-sm mb-auto"
                style={{ opacity: Math.min(1, viseme.mouthOpen * 1.5) }}
              />
              {/* Throat depth */}
              <div className="w-2/3 h-1/2 bg-red-950/80 rounded-full my-auto" />
              {/* Lower teeth/tongue hint */}
              <div
                className="w-3/5 h-[2px] bg-rose-200/70 rounded-sm mt-auto"
                style={{ opacity: Math.min(0.8, viseme.mouthOpen) }}
              />
            </div>
          )}
        </div>

        {/* Eye blink simulator overlay */}
        {viseme.eyeblink && (
          <div
            className="absolute pointer-events-none flex justify-center gap-6"
            style={{ top: '38%', width: '100%' }}
          >
            <div className="w-5 h-[3px] bg-amber-950/80 rounded-full shadow-sm" />
            <div className="w-5 h-[3px] bg-amber-950/80 rounded-full shadow-sm" />
          </div>
        )}

        {/* Audio Reactive Spectrum Ring when speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 border-2 border-cyan-400/60 rounded-2xl animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Status HUD tag */}
      {!compact && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] text-neutral-300 font-mono">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'
            }`}
          />
          {isSpeaking ? 'AI Lip-Sync Active' : 'Ready • Neural Twin'}
        </div>
      )}

      {/* Fidelity score tag */}
      {!compact && avatar.isUserDigitalTwin && (
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-[9px] text-cyan-300 font-medium">
          {avatar.fidelityScore}% Fidelity
        </div>
      )}
    </div>
  );
};
