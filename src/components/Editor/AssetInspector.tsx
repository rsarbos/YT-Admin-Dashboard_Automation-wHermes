import React, { useState } from 'react';
import { Sliders, Sparkles, Volume2, Film, Palette, User, Music, Type, Check, RefreshCw } from 'lucide-react';
import { TimelineScene, VideoProject, CaptionStyle, AvatarProfile, VoiceProfile } from '../../types';
import { CAPTION_STYLES } from '../../data/mockData';

interface AssetInspectorProps {
  activeScene: TimelineScene;
  project: VideoProject;
  avatars: AvatarProfile[];
  voices: VoiceProfile[];
  onUpdateScene: (updated: TimelineScene) => void;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
  onTestVoiceover: (text: string) => void;
}

export const AssetInspector: React.FC<AssetInspectorProps> = ({
  activeScene,
  project,
  avatars,
  voices,
  onUpdateScene,
  onUpdateProject,
  onTestVoiceover,
}) => {
  const [activeTab, setActiveTab] = useState<'scene' | 'avatar' | 'captions' | 'voice'>('scene');
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);

  // Quick regenerate visual asset using curated high quality short-form visual libraries
  const handleRegenerateVisual = () => {
    setIsGeneratingVisual(true);
    setTimeout(() => {
      const visualPool = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      ];
      const randomUrl = visualPool[Math.floor(Math.random() * visualPool.length)];
      onUpdateScene({
        ...activeScene,
        bRollImageUrl: randomUrl,
      });
      setIsGeneratingVisual(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/90 rounded-2xl border border-white/5 overflow-hidden shadow-xl">
      {/* Inspector Tabs */}
      <div className="flex border-b border-white/5 bg-neutral-950/70 p-1">
        <button
          onClick={() => setActiveTab('scene')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'scene'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-cyan-400" />
          <span>Scene</span>
        </button>

        <button
          onClick={() => setActiveTab('captions')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'captions'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Type className="w-3.5 h-3.5 text-amber-400" />
          <span>Captions</span>
        </button>

        <button
          onClick={() => setActiveTab('avatar')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'avatar'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <User className="w-3.5 h-3.5 text-purple-400" />
          <span>Avatar</span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'voice'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Voice</span>
        </button>
      </div>

      {/* Inspector Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-neutral-300">
        {/* TAB 1: SCENE EDITING */}
        {activeTab === 'scene' && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Scene Title & Duration
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activeScene.title}
                  onChange={(e) => onUpdateScene({ ...activeScene, title: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-neutral-950 border border-white/10 rounded-xl text-neutral-100 focus:outline-none focus:border-cyan-500 font-medium text-xs"
                />
                <div className="flex items-center gap-1 bg-neutral-950 border border-white/10 px-2 py-1.5 rounded-xl font-mono text-[11px]">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="60"
                    value={activeScene.duration}
                    onChange={(e) =>
                      onUpdateScene({ ...activeScene, duration: Math.max(1, parseFloat(e.target.value) || 1) })
                    }
                    className="w-10 bg-transparent text-right text-cyan-400 focus:outline-none"
                  />
                  <span>s</span>
                </div>
              </div>
            </div>

            {/* Narration script */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Voiceover Narration
                </label>
                <button
                  onClick={() => onTestVoiceover(activeScene.narration)}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Preview Voice</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={activeScene.narration}
                onChange={(e) => onUpdateScene({ ...activeScene, narration: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-neutral-100 focus:outline-none focus:border-cyan-500 text-xs resize-none"
              />
            </div>

            {/* Visual B-Roll Prompt & Model */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Visual Generation Model & Prompt
                </label>
                <button
                  onClick={handleRegenerateVisual}
                  disabled={isGeneratingVisual}
                  className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 font-medium disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingVisual ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingVisual ? 'Generating...' : 'Re-infer'}</span>
                </button>
              </div>

              <select
                value={activeScene.visualModel}
                onChange={(e) =>
                  onUpdateScene({
                    ...activeScene,
                    visualModel: e.target.value as any,
                  })
                }
                className="w-full mb-2 px-3 py-1.5 bg-neutral-950 border border-white/10 rounded-xl text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="Flux Pro 1.1">Flux Pro 1.1 (Photorealistic 8K)</option>
                <option value="Gemini 3.8 Visual">Gemini 3.8 Visual (Context-Aware)</option>
                <option value="Imagen 3">Google Imagen 3 (High Dynamic Range)</option>
                <option value="SD 3.5">Stable Diffusion 3.5 Large</option>
                <option value="Veo 3.1">Veo 3.1 (Cinematic AI Video)</option>
              </select>

              <textarea
                rows={3}
                value={activeScene.bRollPrompt}
                onChange={(e) => onUpdateScene({ ...activeScene, bRollPrompt: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-neutral-300 focus:outline-none focus:border-purple-500 text-xs resize-none font-mono text-[11px]"
              />
            </div>

            {/* Pacing, Zoom & SFX */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Camera Zoom Style
                </label>
                <select
                  value={activeScene.cameraZoom}
                  onChange={(e) => onUpdateScene({ ...activeScene, cameraZoom: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="1.0x wide">1.0x Wide Static</option>
                  <option value="1.15x push-in">1.15x Slow Push-In</option>
                  <option value="1.25x snap zoom">1.25x Dynamic Snap Zoom</option>
                  <option value="0.9x pull-out">0.9x Dramatic Pull-Out</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Sound FX Trigger
                </label>
                <select
                  value={activeScene.sfx}
                  onChange={(e) => onUpdateScene({ ...activeScene, sfx: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-white/10 rounded-xl text-amber-300 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="Sub Bass Drop & Vinyl Scratch">🚨 Sub Bass Drop</option>
                  <option value="Digital Glitch Pop">⚡ Digital Glitch</option>
                  <option value="Cash Register Ding">💰 Cash Register Ding</option>
                  <option value="Whoosh & Reverse Cymbal">💨 High Whoosh Sweep</option>
                  <option value="Rising Cinematic Bass Drop">🔥 Riser Climax</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: CAPTIONS STYLING */}
        {activeTab === 'captions' && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Active Caption Text
              </label>
              <input
                type="text"
                value={activeScene.caption}
                onChange={(e) => onUpdateScene({ ...activeScene, caption: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Kinetic Caption Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CAPTION_STYLES.map((style) => {
                  const isSelected = project.captionStyle.id === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => onUpdateProject({ captionStyle: style })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/50'
                          : 'bg-neutral-950/60 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-neutral-200 text-xs">{style.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <div
                        className="text-[11px] font-black uppercase tracking-tight truncate mt-1"
                        style={{ color: style.highlightColor }}
                      >
                        SAMPLE POP 💥
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-neutral-950/70 border border-white/5 rounded-xl space-y-2">
              <span className="text-[11px] font-semibold text-neutral-300 block">
                Caption Fine-Tuning
              </span>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-xs">Font Size</span>
                <span className="font-mono text-amber-400">{project.captionStyle.fontSize}px</span>
              </div>
              <input
                type="range"
                min={18}
                max={36}
                value={project.captionStyle.fontSize}
                onChange={(e) =>
                  onUpdateProject({
                    captionStyle: {
                      ...project.captionStyle,
                      fontSize: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </>
        )}

        {/* TAB 3: AVATAR & DIGITAL TWIN */}
        {activeTab === 'avatar' && (
          <>
            <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-white/5">
              <div>
                <span className="font-semibold text-neutral-200 block">Avatar Overlay</span>
                <span className="text-[11px] text-neutral-400">
                  {project.avatarOverlay.enabled ? 'Render lip-synced avatar' : 'Hidden'}
                </span>
              </div>
              <button
                onClick={() =>
                  onUpdateProject({
                    avatarOverlay: {
                      ...project.avatarOverlay,
                      enabled: !project.avatarOverlay.enabled,
                    },
                  })
                }
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  project.avatarOverlay.enabled ? 'bg-cyan-500' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    project.avatarOverlay.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Active Digital Twin Profile
              </label>
              <select
                value={project.avatarOverlay.avatarId}
                onChange={(e) =>
                  onUpdateProject({
                    avatarOverlay: {
                      ...project.avatarOverlay,
                      avatarId: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-cyan-300 font-medium text-xs focus:outline-none focus:border-cyan-500"
              >
                {avatars.map((av) => (
                  <option key={av.id} value={av.id}>
                    {av.name} ({av.isUserDigitalTwin ? 'Your Clone • 99.4%' : 'Studio'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Canvas Placement
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'bottom-right', label: 'Bottom Right PiP' },
                  { id: 'bottom-center', label: 'Bottom Center' },
                  { id: 'pip', label: 'Top Right PiP' },
                  { id: 'center-stage', label: 'Full Stage Presenter' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() =>
                      onUpdateProject({
                        avatarOverlay: {
                          ...project.avatarOverlay,
                          position: pos.id as any,
                        },
                      })
                    }
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition-colors ${
                      project.avatarOverlay.position === pos.id
                        ? 'bg-purple-900/30 border-purple-400 text-purple-200'
                        : 'bg-neutral-950 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scene specific emotion */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Avatar Emotion for This Scene
              </label>
              <select
                value={activeScene.avatarEmotion}
                onChange={(e) =>
                  onUpdateScene({
                    ...activeScene,
                    avatarEmotion: e.target.value as any,
                  })
                }
                className="w-full px-3 py-1.5 bg-neutral-950 border border-white/10 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="shocked">😲 Shocked (Pattern interrupt)</option>
                <option value="confident">😎 Confident / Authority</option>
                <option value="educational">🧠 Educational Breakdown</option>
                <option value="intense">⚡ High-Stakes / Intense</option>
                <option value="friendly_smile">😊 Warm / Trust CTA</option>
              </select>
            </div>

            {/* Transparent green screen cutout toggle */}
            <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-white/5">
              <div>
                <span className="font-semibold text-neutral-200 block text-xs">
                  Chroma Key Transparent Cutout
                </span>
                <span className="text-[10px] text-neutral-400">
                  Isolate avatar face & torso over B-Roll background
                </span>
              </div>
              <input
                type="checkbox"
                checked={project.avatarOverlay.showCutout}
                onChange={(e) =>
                  onUpdateProject({
                    avatarOverlay: {
                      ...project.avatarOverlay,
                      showCutout: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>
          </>
        )}

        {/* TAB 4: VOICE CLONING & TTS */}
        {activeTab === 'voice' && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Active Voice Engine
              </label>
              <div className="space-y-2">
                {voices.map((v) => {
                  const isSelected = project.voiceConfig.voiceId === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() =>
                        onUpdateProject({
                          voiceConfig: {
                            ...project.voiceConfig,
                            voiceId: v.id,
                            isCustomClone: v.isCustomClone,
                          },
                        })
                      }
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400/50'
                          : 'bg-neutral-950 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-200 text-xs">{v.name}</span>
                        {v.isCustomClone ? (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[9px] text-cyan-300 font-mono">
                            My Cloned Voice
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-400 font-mono">{v.geminiVoiceName}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                        {v.toneDescription}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 space-y-3">
              <span className="text-[11px] font-semibold text-neutral-300 block">
                Speech Cadence & Pitch Calibration
              </span>

              <div>
                <div className="flex justify-between text-xs text-neutral-400 mb-1">
                  <span>Pacing Cadence</span>
                  <span className="font-mono text-emerald-400">{project.voiceConfig.cadence}x speed</span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={1.4}
                  step={0.05}
                  value={project.voiceConfig.cadence}
                  onChange={(e) =>
                    onUpdateProject({
                      voiceConfig: {
                        ...project.voiceConfig,
                        cadence: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
