export type AspectRatio = '9:16' | '16:9';
export type GuidedStep = 1 | 2 | 3 | 4 | 5;

export type NavigationTab =
  | 'editor'
  | 'channels'
  | 'keywords'
  | 'competitors'
  | 'avatar'
  | 'thumbnails'
  | 'distribution'
  | 'cloudgpu';

export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  niche: string;
  primaryColor: string;
  brandFont: string;
  defaultAvatarId: string;
  defaultVoiceId: string;
  isTemplate?: boolean;
  status?: 'active' | 'template' | 'connected';
  connectedPlatforms: {
    youtube: boolean;
    tiktok: boolean;
    instagram: boolean;
  };
  metrics: {
    targetDuration: string;
    shortsCount: number;
    targetPacingWpm: number;
    voiceStatus: string;
    avatarStatus: string;
  };
}

export interface TimelineScene {
  id: string;
  title: string;
  start: number; // in seconds
  duration: number; // in seconds
  narration: string;
  bRollPrompt: string;
  bRollImageUrl?: string;
  caption: string;
  sfx: string;
  avatarEmotion: 'confident' | 'shocked' | 'educational' | 'intense' | 'friendly_smile';
  cameraZoom: string;
  visualModel: 'Gemini 3.8 Visual' | 'Imagen 3' | 'Flux Pro 1.1' | 'SD 3.5' | 'Veo 3.1';
}

export interface CaptionStyle {
  id: string;
  name: string;
  fontFamily: string;
  color: string;
  highlightColor: string;
  backgroundColor?: string;
  uppercase: boolean;
  animation: 'hormozi-punch' | 'neon-glow' | 'karaoke-slide' | 'minimal-fade';
  fontSize: number;
}

export interface VideoProject {
  id: string;
  title: string;
  channelId: string;
  aspectRatio: AspectRatio;
  durationSeconds: number;
  hook: string;
  scenes: TimelineScene[];
  captionStyle: CaptionStyle;
  tags: string[];
  searchVolumeRank: number;
  avatarOverlay: {
    enabled: boolean;
    avatarId: string;
    position: 'bottom-right' | 'pip' | 'center-stage' | 'bottom-center';
    scale: number;
    showCutout: boolean; // green-screen transparency
    lipSyncSyncRate: number;
  };
  voiceConfig: {
    voiceId: string;
    isCustomClone: boolean;
    pitch: number;
    cadence: number;
    audioUrl?: string;
  };
  thumbnail: {
    textOverlay: string;
    avatarReaction: string;
    primaryBgUrl?: string;
    accentColor: string;
  };
  status: 'draft' | 'rendering' | 'ready' | 'scheduled' | 'published';
}

export interface AvatarProfile {
  id: string;
  name: string;
  imageUrl: string;
  userUploadedPhotoUrl?: string;
  lightingPreset: 'Cyber RGB Studio' | 'Softbox Warm Studio' | 'Moody Dark Executive' | 'High-Key White';
  wardrobe: 'Tech Minimalist Hoodie' | 'Modern Black Suit' | 'Casual Streetwear' | 'Creator Jacket';
  voiceCloneId: string;
  isUserDigitalTwin: boolean;
  trainingSamplesCount: number;
  fidelityScore: number;
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  isCustomClone: boolean;
  sampleAudioDuration?: string;
  geminiVoiceName?: string;
  pitch: number;
  energy: string;
  toneDescription: string;
  customInstructions?: string;
  recordedAudioDataUrl?: string;
  recordingStatus?: 'not_recorded' | 'recording' | 'calibrated';
}

export interface TrendingTopic {
  id: string;
  keyword: string;
  searchVolume: string;
  velocity: string;
  competition: 'Low' | 'Medium' | 'High';
  difficultyScore: number;
  ctrPotential: string;
  viralHookTemplate: string;
  bestFormat: string;
  niche: string;
}

export interface CompetitorBenchmark {
  id: string;
  creatorName: string;
  handle: string;
  subscribers: string;
  avgShortViews: string;
  cutPace: string;
  captionStyle: string;
  topHookFormula: string;
  retentionTechnique: string;
  actionableTakeaway: string;
  avatarUrl: string;
}

export interface CloudGPUNode {
  id: string;
  provider: 'RunPod Serverless' | 'Modal Cloud' | 'AWS EC2 G5' | 'Lambda Labs';
  gpuName: string;
  vram: string;
  currentVramAllocated: string;
  gpuUtilization: number;
  temperature: number;
  encoderMultiplier: string;
  costPerHour: string;
  status: 'active' | 'standby' | 'rendering';
}

export interface ScheduledPost {
  id: string;
  projectId: string;
  title: string;
  channelId: string;
  platforms: ('youtube' | 'tiktok' | 'instagram')[];
  scheduledTime: string;
  status: 'scheduled' | 'posting' | 'completed' | 'draft';
  targetHook: string;
}
