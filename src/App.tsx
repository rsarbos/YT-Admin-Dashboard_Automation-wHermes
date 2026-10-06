import React, { useState, useEffect, useRef } from 'react';
import {
  INITIAL_CHANNELS,
  INITIAL_PROJECT,
  INITIAL_AVATARS,
  INITIAL_VOICES,
  INITIAL_TRENDS,
  INITIAL_COMPETITORS,
  INITIAL_GPU_NODES,
  INITIAL_SCHEDULED_POSTS,
} from './data/mockData';
import {
  Channel,
  VideoProject,
  TimelineScene,
  AvatarProfile,
  VoiceProfile,
  TrendingTopic,
  CompetitorBenchmark as CompetitorType,
  CloudGPUNode,
  ScheduledPost,
  GuidedStep,
} from './types';
import { VisemeState, AudioLipSyncManager } from './utils/audioLipSync';
import { Header } from './components/Navigation/Header';
import { Sidebar, NavigationTab } from './components/Navigation/Sidebar';
import { GuidedStepper } from './components/GuidedWorkflow/GuidedStepper';
import { VideoCanvas } from './components/Editor/VideoCanvas';
import { Timeline } from './components/Editor/Timeline';
import { AssetInspector } from './components/Editor/AssetInspector';
import { ChannelManager } from './components/Channels/ChannelManager';
import { AvatarVoiceStudio } from './components/AvatarStudio/AvatarVoiceStudio';
import { KeywordRadar } from './components/Keywords/KeywordRadar';
import { CompetitorBenchmark } from './components/Competitors/CompetitorBenchmark';
import { ThumbnailStudio } from './components/Thumbnails/ThumbnailStudio';
import { CrossPostHub } from './components/Distribution/CrossPostHub';
import { CloudGPUCluster } from './components/CloudGPU/CloudGPUCluster';
import { NewProjectModal } from './components/Modals/NewProjectModal';
import { HermesChatFloating } from './components/Hermes/HermesChatFloating';

export default function App() {
  // Navigation & Guided Stepper states
  const [activeTab, setActiveTab] = useState<NavigationTab>('editor');
  const [currentStep, setCurrentStep] = useState<GuidedStep>(1);
  const [isGuidedMode, setIsGuidedMode] = useState<boolean>(true);
  const [avatarStudioTab, setAvatarStudioTab] = useState<'avatar' | 'voice'>('avatar');

  // Channels state
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<string>(INITIAL_CHANNELS[0].id);

  // Projects state
  const [project, setProject] = useState<VideoProject>(INITIAL_PROJECT);
  const [activeSceneId, setActiveSceneId] = useState<string>(INITIAL_PROJECT.scenes[0].id);

  // Avatar & Voice states
  const [avatars, setAvatars] = useState<AvatarProfile[]>(INITIAL_AVATARS);
  const [voices, setVoices] = useState<VoiceProfile[]>(INITIAL_VOICES);

  // Trends & Competitors
  const [trends, setTrends] = useState<TrendingTopic[]>(INITIAL_TRENDS);
  const [isRefreshingTrends, setIsRefreshingTrends] = useState<boolean>(false);
  const [competitors, setCompetitors] = useState<CompetitorType[]>(INITIAL_COMPETITORS);

  // GPU & Distribution
  const [gpuNodes, setGpuNodes] = useState<CloudGPUNode[]>(INITIAL_GPU_NODES);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED_POSTS);

  // Playback & Lip-Sync state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [viseme, setViseme] = useState<VisemeState>({
    mouthOpen: 0,
    mouthWidth: 1.0,
    jawOffset: 0,
    eyeblink: false,
    headTilt: 0,
  });

  // Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  const lipSyncRef = useRef<AudioLipSyncManager | null>(null);
  const playbackTimerRef = useRef<any>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const activeAvatar = avatars.find((a) => a.id === project.avatarOverlay.avatarId) || avatars[0];
  const activeScene =
    project.scenes.find((s) => s.id === activeSceneId) || project.scenes[0];

  // User completion checklist
  const hasUploadedPhoto = !!activeAvatar.userUploadedPhotoUrl;
  const userVoice = voices.find((v) => v.isCustomClone);
  const hasRecordedVoice = !!userVoice?.recordedAudioDataUrl;
  const hasChannelSet = true;

  // Initialize LipSync Manager
  useEffect(() => {
    lipSyncRef.current = new AudioLipSyncManager((v) => setViseme(v));
    return () => {
      if (lipSyncRef.current) lipSyncRef.current.stop();
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, []);

  // Update current active scene based on currentTime
  useEffect(() => {
    const matching = project.scenes.find(
      (s) => currentTime >= s.start && currentTime < s.start + s.duration
    );
    if (matching && matching.id !== activeSceneId) {
      setActiveSceneId(matching.id);
    }
  }, [currentTime, project.scenes, activeSceneId]);

  // Stepper Step Switcher
  const handleSelectStep = (step: GuidedStep) => {
    setCurrentStep(step);
    if (step === 1) {
      setActiveTab('channels');
    } else if (step === 2) {
      setActiveTab('avatar');
      setAvatarStudioTab('avatar');
    } else if (step === 3) {
      setActiveTab('avatar');
      setAvatarStudioTab('voice');
    } else if (step === 4) {
      setActiveTab('keywords');
    } else if (step === 5) {
      setActiveTab('editor');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      handleSelectStep(2);
    } else if (currentStep === 2) {
      handleSelectStep(3);
    } else if (currentStep === 3) {
      handleSelectStep(4);
    } else if (currentStep === 4) {
      // Prompt modal or advance to editor
      setIsNewModalOpen(true);
    } else if (currentStep === 5) {
      setActiveTab('cloudgpu');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      handleSelectStep((currentStep - 1) as GuidedStep);
    }
  };

  // Handle Playback Loop
  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setIsSpeaking(false);
      if (lipSyncRef.current) lipSyncRef.current.stop();
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    } else {
      setIsPlaying(true);
      setIsSpeaking(true);

      // Speak current scene narration with realistic lip-sync
      if (lipSyncRef.current && activeScene) {
        lipSyncRef.current.speak(activeScene.narration, null, () => {
          setIsSpeaking(false);
        });
      }

      playbackTimerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= project.durationSeconds) {
            return 0;
          }
          return Math.round((prev + 0.1) * 10) / 10;
        });
      }, 100);
    }
  };

  // Seek timecode
  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  // Test individual scene voiceover
  const handleTestVoiceover = (text: string) => {
    if (lipSyncRef.current) {
      setIsSpeaking(true);
      lipSyncRef.current.speak(text, null, () => {
        setIsSpeaking(false);
      });
    }
  };

  // Handle scene update
  const handleUpdateScene = (updated: TimelineScene) => {
    const newScenes = project.scenes.map((s) => (s.id === updated.id ? updated : s));
    setProject({ ...project, scenes: newScenes });
  };

  // Launch project from keyword trend
  const handleLaunchTopicProject = (topic: TrendingTopic) => {
    setIsNewModalOpen(true);
  };

  // Refresh trends using backend AI
  const handleRefreshTrends = async () => {
    setIsRefreshingTrends(true);
    try {
      const res = await fetch('/api/ai/keywords-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: activeChannel.niche, channelName: activeChannel.name }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.trends && Array.isArray(data.trends)) {
          const mapped: TrendingTopic[] = data.trends.map((t: any, idx: number) => ({
            id: `tr-${Date.now()}-${idx}`,
            keyword: t.keyword,
            searchVolume: t.searchVolume,
            velocity: t.velocity,
            competition: t.competition as any,
            difficultyScore: t.difficultyScore,
            ctrPotential: t.ctrPotential,
            viralHookTemplate: t.viralHookTemplate,
            bestFormat: t.bestFormat,
            niche: activeChannel.niche,
          }));
          setTrends(mapped);
        }
      }
    } catch (e) {
      console.warn('Could not refresh trends via API, using current trends', e);
    } finally {
      setIsRefreshingTrends(false);
    }
  };

  // Apply competitor formula
  const handleApplyCompetitorStrategy = (comp: CompetitorType) => {
    if (project.scenes.length > 0) {
      const firstScene = {
        ...project.scenes[0],
        narration: `${comp.topHookFormula.replace(/"/g, '')} Here is why:`,
        caption: `${comp.topHookFormula.replace(/"/g, '').toUpperCase()} 🚨`,
      };
      const updatedScenes = [firstScene, ...project.scenes.slice(1)];
      setProject({
        ...project,
        hook: comp.topHookFormula,
        scenes: updatedScenes,
      });
      setActiveTab('editor');
      setCurrentStep(5);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#090a0f] text-neutral-100">
      {/* Top Header */}
      <Header
        channels={channels}
        activeChannel={activeChannel}
        project={project}
        onSelectChannel={(id) => setActiveChannelId(id)}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onTriggerExport={() => setActiveTab('cloudgpu')}
      />

      {/* Guided Step-by-Step Workflow Progress Bar */}
      <GuidedStepper
        currentStep={currentStep}
        isGuidedMode={isGuidedMode}
        hasUploadedPhoto={hasUploadedPhoto}
        hasRecordedVoice={hasRecordedVoice}
        hasChannelSet={hasChannelSet}
        onSelectStep={handleSelectStep}
        onToggleGuidedMode={() => setIsGuidedMode(!isGuidedMode)}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
      />

      {/* Main App Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar activeTab={activeTab} onSelectTab={(t) => setActiveTab(t)} />

        {/* Central Workspace Area */}
        <main className="flex-1 overflow-y-auto p-5 bg-[#090a0f]">
          {/* TAB 1: INTEGRATED AI VIDEO EDITOR (Step 5) */}
          {activeTab === 'editor' && (
            <div className="flex flex-col gap-5 h-full min-h-[750px]">
              {/* Upper Section: Canvas (Left) + Inspector (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[500px]">
                {/* Video Canvas Stage (8 cols) */}
                <div className="lg:col-span-7 xl:col-span-8 h-full">
                  <VideoCanvas
                    project={project}
                    activeScene={activeScene}
                    activeAvatar={activeAvatar}
                    currentTime={currentTime}
                    isPlaying={isPlaying}
                    viseme={viseme}
                    isSpeaking={isSpeaking}
                    onPlayToggle={handlePlayToggle}
                    onSeek={handleSeek}
                    onAspectRatioToggle={() =>
                      setProject({
                        ...project,
                        aspectRatio: project.aspectRatio === '9:16' ? '16:9' : '9:16',
                      })
                    }
                  />
                </div>

                {/* Right Inspector Drawer (4 cols) */}
                <div className="lg:col-span-5 xl:col-span-4 h-full">
                  <AssetInspector
                    activeScene={activeScene}
                    project={project}
                    avatars={avatars}
                    voices={voices}
                    onUpdateScene={handleUpdateScene}
                    onUpdateProject={(upd) => setProject({ ...project, ...upd })}
                    onTestVoiceover={handleTestVoiceover}
                  />
                </div>
              </div>

              {/* Lower Section: Multi-Track Drag & Drop Timeline */}
              <div className="shrink-0">
                <Timeline
                  project={project}
                  activeSceneId={activeSceneId}
                  currentTime={currentTime}
                  onSelectScene={(id) => {
                    setActiveSceneId(id);
                    const scene = project.scenes.find((s) => s.id === id);
                    if (scene) setCurrentTime(scene.start);
                  }}
                  onUpdateScenes={(newScenes) => {
                    const totalDur = newScenes.reduce((acc, s) => acc + s.duration, 0);
                    setProject({
                      ...project,
                      scenes: newScenes,
                      durationSeconds: totalDur,
                    });
                  }}
                  onSeek={handleSeek}
                />
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-CHANNEL NETWORK (Step 1) */}
          {activeTab === 'channels' && (
            <ChannelManager
              channels={channels}
              activeChannelId={activeChannelId}
              onSelectChannel={(id) => setActiveChannelId(id)}
              onAddChannel={(c) => setChannels([...channels, c])}
              onUpdateChannel={(updated) =>
                setChannels(channels.map((c) => (c.id === updated.id ? updated : c)))
              }
              onProceedToNextStep={() => handleSelectStep(2)}
            />
          )}

          {/* TAB 3: RANKED KEYWORDS & BREAKOUT TOPICS (Step 4) */}
          {activeTab === 'keywords' && (
            <KeywordRadar
              trends={trends}
              activeChannel={activeChannel}
              onLaunchTopicProject={handleLaunchTopicProject}
              onRefreshTrends={handleRefreshTrends}
              isRefreshing={isRefreshingTrends}
            />
          )}

          {/* TAB 4: COMPETITORS BENCHMARK & HOOK DISSECTOR */}
          {activeTab === 'competitors' && (
            <CompetitorBenchmark
              competitors={competitors}
              activeChannel={activeChannel}
              onApplyStrategy={handleApplyCompetitorStrategy}
            />
          )}

          {/* TAB 5: REALISTIC AVATAR & CUSTOM VOICE STUDIO (Steps 2 & 3) */}
          {activeTab === 'avatar' && (
            <AvatarVoiceStudio
              avatars={avatars}
              voices={voices}
              initialTab={avatarStudioTab}
              onProceedToNextStep={() => handleSelectStep(4)}
              onUpdateAvatar={(updated) => {
                setAvatars(avatars.map((a) => (a.id === updated.id ? updated : a)));
                setProject((prev) => ({
                  ...prev,
                  avatarOverlay: {
                    ...prev.avatarOverlay,
                    avatarId: updated.id,
                  },
                }));
              }}
              onUpdateVoice={(updated) => {
                setVoices(voices.map((v) => (v.id === updated.id ? updated : v)));
                setProject((prev) => ({
                  ...prev,
                  voiceConfig: {
                    ...prev.voiceConfig,
                    voiceId: updated.id,
                  },
                }));
              }}
            />
          )}

          {/* TAB 6: THUMBNAIL STUDIO & SEO */}
          {activeTab === 'thumbnails' && (
            <ThumbnailStudio
              project={project}
              channel={activeChannel}
              activeAvatar={activeAvatar}
              onUpdateProject={(upd) => setProject({ ...project, ...upd })}
            />
          )}

          {/* TAB 7: CROSS-POST DISTRIBUTION HUB */}
          {activeTab === 'distribution' && (
            <CrossPostHub
              project={project}
              channel={activeChannel}
              scheduledPosts={scheduledPosts}
              onAddScheduledPost={(post) => setScheduledPosts([post, ...scheduledPosts])}
            />
          )}

          {/* TAB 8: CLOUD GPU CLUSTER & RENDER ACCELERATION */}
          {activeTab === 'cloudgpu' && (
            <CloudGPUCluster gpuNodes={gpuNodes} project={project} avatar={activeAvatar} />
          )}
        </main>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        channel={activeChannel}
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreated={(newProj) => {
          setProject(newProj);
          setActiveSceneId(newProj.scenes[0].id);
          setCurrentTime(0);
          setActiveTab('editor');
          setCurrentStep(5);
        }}
      />

      {/* Floating Hermes Agent Chat Window (MCP Connected) */}
      <HermesChatFloating
        project={project}
        channel={activeChannel}
        avatar={activeAvatar}
        voice={voices.find((v) => v.isCustomClone) || voices[0]}
        onApplyHook={(newHook, newTitle) => {
          setProject((prev) => {
            const updatedScenes = [...prev.scenes];
            if (updatedScenes.length > 0) {
              updatedScenes[0] = {
                ...updatedScenes[0],
                caption: `${newHook.toUpperCase()} 🚨`,
                narration: `${newHook} Here is what actually happens:`,
              };
            }
            return {
              ...prev,
              title: newTitle || prev.title,
              hook: newHook,
              scenes: updatedScenes,
            };
          });
        }}
        onUpdateVoiceInstructions={(newInstructions) => {
          setVoices((prev) =>
            prev.map((v) => (v.isCustomClone ? { ...v, customInstructions: newInstructions } : v))
          );
        }}
        onTriggerRender={() => {
          setActiveTab('cloudgpu');
        }}
      />
    </div>
  );
}
