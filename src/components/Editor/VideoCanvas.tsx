import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Shield, Eye, Sparkles } from 'lucide-react';
import { VideoProject, TimelineScene, AvatarProfile, CaptionStyle } from '../../types';
import { RealisticAvatarCanvas } from '../AvatarStudio/RealisticAvatarCanvas';
import { VisemeState } from '../../utils/audioLipSync';

interface VideoCanvasProps {
  project: VideoProject;
  activeScene: TimelineScene;
  activeAvatar: AvatarProfile;
  currentTime: number;
  isPlaying: boolean;
  viseme: VisemeState;
  isSpeaking: boolean;
  onPlayToggle: () => void;
  onSeek: (seconds: number) => void;
  onAspectRatioToggle: () => void;
}

export const VideoCanvas: React.FC<VideoCanvasProps> = ({
  project,
  activeScene,
  activeAvatar,
  currentTime,
  isPlaying,
  viseme,
  isSpeaking,
  onPlayToggle,
  onSeek,
  onAspectRatioToggle,
}) => {
  const [showSafeZones, setShowSafeZones] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  // Determine avatar position classes inside canvas
  const getAvatarPositionClass = () => {
    switch (project.avatarOverlay.position) {
      case 'bottom-right':
        return 'bottom-16 right-4 w-32 h-44';
      case 'pip':
        return 'top-12 right-4 w-28 h-36';
      case 'center-stage':
        return 'bottom-12 left-1/2 -translate-x-1/2 w-48 h-64';
      case 'bottom-center':
      default:
        return 'bottom-14 left-1/2 -translate-x-1/2 w-36 h-48';
    }
  };

  // Dynamic kinetic caption animation
  const renderCaptionText = (caption: string, style: CaptionStyle) => {
    const words = caption.split(' ');
    return (
      <div
        className={`px-4 py-2 text-center rounded-xl transition-all duration-150 ${
          style.uppercase ? 'uppercase' : ''
        }`}
        style={{
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
          backgroundColor: style.backgroundColor || 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {words.map((word, idx) => {
          // Highlight punchy keywords or alternate words
          const isHighlight =
            word.includes('!') ||
            word.includes('10X') ||
            word.includes('99%') ||
            word.includes('RULE') ||
            word.includes('HOOK') ||
            word.includes('NEVER') ||
            word.includes('DISRUPTION') ||
            idx % 3 === 1;

          return (
            <span
              key={idx}
              className={`inline-block mx-1 transition-transform duration-100 ${
                isHighlight ? 'scale-105 font-black' : 'font-bold'
              }`}
              style={{
                color: isHighlight ? style.highlightColor : style.color,
                textShadow: isHighlight
                  ? `0 0 16px ${style.highlightColor}80, 0 3px 6px rgba(0,0,0,0.9)`
                  : '0 2px 6px rgba(0,0,0,0.9)',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  const isVertical = project.aspectRatio === '9:16';

  return (
    <div className="flex flex-col h-full bg-neutral-950/80 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Top Bar inside canvas container */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/60 border-b border-white/5 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-200">{project.title}</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono text-[10px]">
            {project.aspectRatio} Short
          </span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-300 font-mono">{activeScene.visualModel}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSafeZones(!showSafeZones)}
            title="Toggle YouTube Shorts / TikTok UI safe-zones"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
              showSafeZones
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Safe Zones {showSafeZones ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onAspectRatioToggle}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-200 text-[11px]"
          >
            Ratio: {project.aspectRatio}
          </button>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div className="flex-1 relative flex items-center justify-center p-4 bg-gradient-to-b from-neutral-950 via-[#0d0f17] to-neutral-950 overflow-hidden">
        {/* Frame container matching chosen aspect ratio */}
        <div
          className={`relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 ${
            isVertical ? 'w-[320px] h-[568px] sm:w-[350px] sm:h-[622px]' : 'w-full max-w-[760px] aspect-video'
          }`}
          style={{
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(6, 182, 212, 0.1)',
          }}
        >
          {/* Layer 1: Background Visual / B-Roll Image */}
          <div className="absolute inset-0 bg-neutral-900">
            {activeScene.bRollImageUrl ? (
              <img
                src={activeScene.bRollImageUrl}
                alt={activeScene.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  activeScene.cameraZoom.includes('zoom') ? 'scale-110' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-cyan-950 p-6 text-center">
                <p className="text-neutral-400 text-sm">{activeScene.bRollPrompt}</p>
              </div>
            )}

            {/* Cinematic subtle vignette & gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Layer 2: SFX Cue Notification badge */}
          {activeScene.sfx && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-mono shadow-lg animate-pulse-subtle">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>SFX: {activeScene.sfx}</span>
            </div>
          )}

          {/* Layer 3: Realistic Lip-Sync Avatar Overlay */}
          {project.avatarOverlay.enabled && (
            <div
              className={`absolute z-20 pointer-events-none transition-all duration-300 ${getAvatarPositionClass()}`}
              style={{
                transform: `scale(${project.avatarOverlay.scale})`,
              }}
            >
              <RealisticAvatarCanvas
                avatar={activeAvatar}
                viseme={viseme}
                isSpeaking={isSpeaking}
                showCutout={project.avatarOverlay.showCutout}
                className="w-full h-full shadow-2xl"
              />
            </div>
          )}

          {/* Layer 4: Kinetic Auto-Captions (Center or Lower-Third) */}
          <div className="absolute bottom-28 left-4 right-4 z-30 flex items-center justify-center pointer-events-none">
            {renderCaptionText(activeScene.caption, project.captionStyle)}
          </div>

          {/* Layer 5: YouTube Shorts & TikTok UI Overlay Simulator (Safe-zones) */}
          {showSafeZones && isVertical && (
            <div className="absolute inset-0 z-40 pointer-events-none border-2 border-dashed border-amber-500/40 bg-amber-500/5 flex flex-col justify-between p-3">
              <div className="bg-black/60 text-amber-300 text-[9px] px-2 py-0.5 rounded font-mono w-max">
                Top UI Safe Margin (Search / Sounds)
              </div>

              {/* Right action icons simulation (Like, Dislike, Comment, Share) */}
              <div className="self-end flex flex-col gap-3 text-neutral-400 text-right pr-1">
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[10px]">
                  👍
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[10px]">
                  💬
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[10px]">
                  ↗️
                </div>
              </div>

              <div className="bg-black/60 text-amber-300 text-[9px] px-2 py-0.5 rounded font-mono w-max">
                Bottom UI Safe Margin (Channel Title / Sound Tag)
              </div>
            </div>
          )}

          {/* Real-time playback status pill in corner */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-neutral-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-red-500 animate-ping' : 'bg-neutral-500'
              }`}
            />
            {formatTime(currentTime)} / {formatTime(project.durationSeconds)}
          </div>
        </div>
      </div>

      {/* Scrub & Transport Bar */}
      <div className="px-5 py-3 bg-neutral-900/80 border-t border-white/5 flex flex-col gap-2">
        {/* Progress Timeline Slider */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-neutral-400 w-12 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min={0}
              max={project.durationSeconds}
              step={0.1}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
            />
            {/* Visual scene boundary marks */}
            <div className="absolute inset-0 pointer-events-none flex items-center">
              {project.scenes.map((scene) => (
                <div
                  key={scene.id}
                  className="w-0.5 h-2 bg-neutral-600/70"
                  style={{
                    marginLeft: `${(scene.start / project.durationSeconds) * 100}%`,
                  }}
                  title={scene.title}
                />
              ))}
            </div>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 w-12">
            {formatTime(project.durationSeconds)}
          </span>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSeek(0)}
              title="Rewind to start"
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onPlayToggle}
              className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs rounded-xl transition-transform active:scale-95 shadow-md shadow-cyan-500/20"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play AI Preview</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Scene {project.scenes.findIndex((s) => s.id === activeScene.id) + 1} of {project.scenes.length}:{' '}
              <strong className="text-neutral-200">{activeScene.title}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
