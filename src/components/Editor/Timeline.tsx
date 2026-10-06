import React, { useState } from 'react';
import { Scissors, Plus, Trash2, Copy, Move, Layers, Mic, Subtitles, Volume2, Video, UserCheck, ZoomIn, ZoomOut } from 'lucide-react';
import { TimelineScene, VideoProject } from '../../types';

interface TimelineProps {
  project: VideoProject;
  activeSceneId: string;
  currentTime: number;
  onSelectScene: (sceneId: string) => void;
  onUpdateScenes: (scenes: TimelineScene[]) => void;
  onSeek: (seconds: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  project,
  activeSceneId,
  currentTime,
  onSelectScene,
  onUpdateScenes,
  onSeek,
}) => {
  const [draggedSceneIndex, setDraggedSceneIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 0.8x to 2x

  const totalDuration = project.durationSeconds;

  // Handle Drag & Drop reordering
  const handleDragStart = (index: number) => {
    setDraggedSceneIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSceneIndex === null || draggedSceneIndex === targetIndex) return;

    const newScenes = [...project.scenes];
    const [moved] = newScenes.splice(draggedSceneIndex, 1);
    newScenes.splice(targetIndex, 0, moved);

    // Recompute start timestamps
    let currentStart = 0;
    const recomputed = newScenes.map((sc) => {
      const updated = { ...sc, start: currentStart };
      currentStart += sc.duration;
      return updated;
    });

    setDraggedSceneIndex(targetIndex);
    onUpdateScenes(recomputed);
  };

  // Split active scene at current playhead
  const handleSplitScene = () => {
    const sceneIndex = project.scenes.findIndex((s) => s.id === activeSceneId);
    if (sceneIndex === -1) return;

    const currentScene = project.scenes[sceneIndex];
    const offsetFromStart = currentTime - currentScene.start;

    // Only split if playhead is strictly inside the scene with at least 1s on each side
    if (offsetFromStart < 1.0 || offsetFromStart > currentScene.duration - 1.0) {
      alert('Position playhead at least 1.0s away from scene edges to split.');
      return;
    }

    const firstHalfDuration = Math.round(offsetFromStart * 10) / 10;
    const secondHalfDuration = Math.round((currentScene.duration - firstHalfDuration) * 10) / 10;

    const firstHalf: TimelineScene = {
      ...currentScene,
      duration: firstHalfDuration,
    };

    const secondHalf: TimelineScene = {
      ...currentScene,
      id: 'sc-' + Math.random().toString(36).substring(2, 8),
      title: `${currentScene.title} (Part 2)`,
      start: currentScene.start + firstHalfDuration,
      duration: secondHalfDuration,
    };

    const newScenes = [...project.scenes];
    newScenes.splice(sceneIndex, 1, firstHalf, secondHalf);
    onUpdateScenes(newScenes);
  };

  // Add a new scene
  const handleAddScene = () => {
    const lastScene = project.scenes[project.scenes.length - 1];
    const newStart = lastScene ? lastScene.start + lastScene.duration : 0;
    const newScene: TimelineScene = {
      id: 'sc-' + Math.random().toString(36).substring(2, 8),
      title: `AI Cut ${project.scenes.length + 1}`,
      start: newStart,
      duration: 5.0,
      narration: 'Next key viral takeaway and insight for maximum viewer retention.',
      bRollPrompt: 'Cinematic dynamic visual with high contrast neon lighting and fast camera movement',
      caption: 'KEY INSIGHT: SPEED IS YOUR LEVERAGE 🚀',
      sfx: 'Whoosh & Laser Hit',
      avatarEmotion: 'confident',
      cameraZoom: '1.15x push-in',
      visualModel: 'Flux Pro 1.1',
    };

    onUpdateScenes([...project.scenes, newScene]);
    onSelectScene(newScene.id);
  };

  // Delete scene
  const handleDeleteScene = (sceneId: string) => {
    if (project.scenes.length <= 1) {
      alert('Cannot delete the last remaining scene in the video.');
      return;
    }

    const filtered = project.scenes.filter((s) => s.id !== sceneId);
    let currentStart = 0;
    const recomputed = filtered.map((sc) => {
      const updated = { ...sc, start: currentStart };
      currentStart += sc.duration;
      return updated;
    });

    onUpdateScenes(recomputed);
    if (activeSceneId === sceneId) {
      onSelectScene(recomputed[0].id);
    }
  };

  return (
    <div className="flex flex-col bg-neutral-900/90 rounded-2xl border border-white/5 overflow-hidden shadow-xl">
      {/* Timeline Controls Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-950/70 border-b border-white/5 text-xs text-neutral-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-neutral-200">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Multi-Track Timeline</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Action buttons */}
          <button
            onClick={handleSplitScene}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-[11px] transition-colors"
            title="Split scene at current playhead"
          >
            <Scissors className="w-3.5 h-3.5 text-cyan-400" />
            <span>Split (C)</span>
          </button>

          <button
            onClick={handleAddScene}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[11px] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add AI Scene</span>
          </button>
        </div>

        {/* Zoom & Track info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2 py-1 rounded-lg text-[11px] text-neutral-400">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
              className="hover:text-white"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
              className="hover:text-white"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] font-mono text-neutral-400">
            {project.scenes.length} Scenes • {totalDuration}s Total
          </span>
        </div>
      </div>

      {/* Main Track Workspace */}
      <div className="relative overflow-x-auto p-4 select-none">
        <div
          className="relative min-w-[750px]"
          style={{ width: `${100 * zoomLevel}%` }}
        >
          {/* Timeline Time Ruler */}
          <div className="relative h-6 border-b border-white/10 flex items-center mb-3">
            {Array.from({ length: Math.ceil(totalDuration / 5) + 1 }).map((_, i) => {
              const sec = i * 5;
              const leftPercent = (sec / totalDuration) * 100;
              return (
                <div
                  key={i}
                  className="absolute flex flex-col items-center cursor-pointer group"
                  style={{ left: `${leftPercent}%` }}
                  onClick={() => onSeek(sec)}
                >
                  <span className="text-[9px] font-mono text-neutral-500 group-hover:text-cyan-400 transition-colors">
                    {sec}s
                  </span>
                  <div className="w-px h-1.5 bg-neutral-700 group-hover:bg-cyan-400" />
                </div>
              );
            })}

            {/* Playhead Marker */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none"
              style={{
                left: `${(currentTime / totalDuration) * 100}%`,
              }}
            >
              <div className="w-2.5 h-2.5 bg-cyan-400 rotate-45 -ml-1 -mt-0.5 shadow-md shadow-cyan-400/50" />
              <div className="w-0.5 h-48 bg-cyan-400 shadow-sm" />
            </div>
          </div>

          {/* TRACK 1: Visual / B-Roll Scenes (Draggable Blocks) */}
          <div className="mb-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 mb-1">
              <Video className="w-3.5 h-3.5 text-blue-400" />
              <span>Layer 1: Visual Scenes & B-Roll (Drag to Reorder)</span>
            </div>

            <div className="relative h-14 bg-neutral-950/60 rounded-xl border border-white/5 flex gap-1 p-1 overflow-hidden">
              {project.scenes.map((scene, idx) => {
                const widthPercent = (scene.duration / totalDuration) * 100;
                const isActive = scene.id === activeSceneId;

                return (
                  <div
                    key={scene.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onClick={() => onSelectScene(scene.id)}
                    className={`relative h-full rounded-lg cursor-pointer transition-all duration-150 p-2 flex flex-col justify-between overflow-hidden border ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-900/60 to-cyan-900/60 border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                        : 'bg-neutral-800/80 hover:bg-neutral-750 border-white/5 hover:border-white/20'
                    }`}
                    style={{ width: `${widthPercent}%` }}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold truncate text-neutral-200">
                        {idx + 1}. {scene.title}
                      </span>
                      <span className="font-mono text-[9px] text-neutral-400 shrink-0 ml-1">
                        {scene.duration}s
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-neutral-400">
                      <span className="truncate text-cyan-300 font-mono">
                        {scene.visualModel}
                      </span>
                      {isActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteScene(scene.id);
                          }}
                          className="hover:text-red-400 transition-colors p-0.5"
                          title="Delete scene"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 2: Realistic AI Avatar Overlay Track */}
          <div className="mb-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 mb-1">
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Layer 2: 100% Realistic Avatar & Lip-Sync</span>
            </div>

            <div className="relative h-10 bg-neutral-950/60 rounded-xl border border-white/5 flex gap-1 p-1">
              {project.scenes.map((scene) => {
                const widthPercent = (scene.duration / totalDuration) * 100;
                return (
                  <div
                    key={scene.id}
                    className="h-full rounded-lg bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/20 px-2 flex items-center justify-between overflow-hidden"
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span className="text-[10px] text-purple-300 font-medium truncate">
                      Twin Sync • {scene.avatarEmotion}
                    </span>
                    <span className="text-[9px] font-mono text-purple-400/80 shrink-0">
                      60fps
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 3: Voiceover & Audio Waveform Track */}
          <div className="mb-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 mb-1">
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span>Layer 3: Cloned Voiceover & Waveform ({project.voiceConfig.isCustomClone ? 'Custom Twin Voice' : 'AI Voice'})</span>
            </div>

            <div className="relative h-11 bg-neutral-950/60 rounded-xl border border-white/5 flex gap-1 p-1">
              {project.scenes.map((scene) => {
                const widthPercent = (scene.duration / totalDuration) * 100;
                return (
                  <div
                    key={scene.id}
                    className="h-full rounded-lg bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-500/20 px-2 flex items-center gap-2 overflow-hidden"
                    style={{ width: `${widthPercent}%` }}
                  >
                    {/* Simulated Audio Waveform bars */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[12, 18, 14, 24, 16, 20, 8, 15, 22, 10].map((h, i) => (
                        <div
                          key={i}
                          className="w-0.5 bg-emerald-400/70 rounded-full"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-emerald-200 truncate font-mono">
                      "{scene.narration.substring(0, 30)}..."
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 4: Kinetic Auto-Captions Track */}
          <div className="mb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 mb-1">
              <Subtitles className="w-3.5 h-3.5 text-amber-400" />
              <span>Layer 4: Dynamic Auto-Captions ({project.captionStyle.name})</span>
            </div>

            <div className="relative h-9 bg-neutral-950/60 rounded-xl border border-white/5 flex gap-1 p-1">
              {project.scenes.map((scene) => {
                const widthPercent = (scene.duration / totalDuration) * 100;
                return (
                  <div
                    key={scene.id}
                    className="h-full rounded-lg bg-gradient-to-r from-amber-950/40 to-yellow-950/30 border border-amber-500/20 px-2 flex items-center overflow-hidden"
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span className="text-[9px] text-amber-200 truncate font-mono font-bold">
                      {scene.caption}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
