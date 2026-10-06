import React, { useState, useRef, useEffect } from 'react';
import { AvatarProfile, VoiceProfile } from '../../types';
import { RealisticAvatarCanvas } from './RealisticAvatarCanvas';
import { VisemeState, AudioLipSyncManager } from '../../utils/audioLipSync';
import {
  UserCheck,
  Mic,
  Camera,
  Upload,
  Play,
  Pause,
  CheckCircle2,
  Sparkles,
  Sliders,
  Volume2,
  Cpu,
  Layers,
  StopCircle,
  RefreshCw,
  FileAudio,
  FileImage,
  Wand2,
  AlertCircle,
  Check,
  ArrowRight,
  Video,
} from 'lucide-react';

interface AvatarVoiceStudioProps {
  avatars: AvatarProfile[];
  voices: VoiceProfile[];
  onUpdateAvatar: (avatar: AvatarProfile) => void;
  onUpdateVoice: (voice: VoiceProfile) => void;
  initialTab?: 'avatar' | 'voice';
  onProceedToNextStep?: () => void;
}

const GUIDED_RECORDING_SCRIPTS = [
  {
    id: 'script-1',
    title: 'Prompt 1: Short-Form Hook Cadence',
    text: 'Stop scrolling right now. What if everything you were told about growth was completely backwards? Here is what actually happens when you cut out dead air.',
    pacingHint: 'High-energy, direct eye-contact, crisp cadence with no hesitation.',
  },
  {
    id: 'script-2',
    title: 'Prompt 2: Pattern Disruption & Value',
    text: 'The algorithm doesn’t reward grind; it rewards pattern disruption. When we switched this single constraint, our retention tripled in under forty-eight hours.',
    pacingHint: 'Confident, authoritative, punchy emphasis on "tripled" and "forty-eight hours".',
  },
  {
    id: 'script-3',
    title: 'Prompt 3: Loop Call-To-Action',
    text: 'Save this video immediately before it disappears, drop a comment with your biggest roadblock, and watch what happens to your view velocity next.',
    pacingHint: 'Urgent, engaging, smooth upward inflection on the final call to action.',
  },
];

const VOICE_INSTRUCTION_PRESETS = [
  {
    title: 'Viral Short-Form (High Energy)',
    instruction: 'Speak with punchy viral cadence, emphasize hook keywords, zero awkward pauses, and confident crisp condenser mic presence.',
  },
  {
    title: 'Calm Technical Authority',
    instruction: 'Speak with clear, articulate, measured cadence. Sound like a senior engineering director explaining a critical architectural principle.',
  },
  {
    title: 'No-BS Founder Breakdown',
    instruction: 'Direct, rapid-fire, no throat-clearing, high-conviction delivery with sharp emphasis on numbers and metrics.',
  },
];

export const AvatarVoiceStudio: React.FC<AvatarVoiceStudioProps> = ({
  avatars,
  voices,
  onUpdateAvatar,
  onUpdateVoice,
  initialTab = 'avatar',
  onProceedToNextStep,
}) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'voice'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Avatar states
  const userAvatar = avatars.find((a) => a.isUserDigitalTwin) || avatars[0];
  const [isCalibratingFace, setIsCalibratingFace] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [uploadNotification, setUploadNotification] = useState<string | null>(null);

  // File upload & webcam refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Voice recording states
  const userVoice = voices.find((v) => v.isCustomClone) || voices[0];
  const [activeScriptIndex, setActiveScriptIndex] = useState(0);
  const [customInstructions, setCustomInstructions] = useState(
    userVoice.customInstructions || VOICE_INSTRUCTION_PRESETS[0].instruction
  );

  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(userVoice.recordedAudioDataUrl || null);
  const [isCalibratingVoice, setIsCalibratingVoice] = useState(false);
  const [voiceCalibrationDetails, setVoiceCalibrationDetails] = useState<any>(null);

  // Testing Sandbox (Generate Any Words)
  const [testPhrase, setTestPhrase] = useState(
    'This is my authentic cloned voice. I can now speak any script, hook, or phrase you type here with instant lip-sync.'
  );
  const [isSynthesizingSpeech, setIsSynthesizingSpeech] = useState(false);
  const [isTestingSpeech, setIsTestingSpeech] = useState(false);

  // Lip-sync viseme state for real-time canvas animation
  const [viseme, setViseme] = useState<VisemeState>({
    mouthOpen: 0,
    mouthWidth: 1.0,
    jawOffset: 0,
    eyeblink: false,
    headTilt: 0,
  });

  const lipSyncRef = useRef<AudioLipSyncManager | null>(null);
  const micTimerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    lipSyncRef.current = new AudioLipSyncManager((v) => setViseme(v));
    return () => {
      if (lipSyncRef.current) lipSyncRef.current.stop();
      if (micTimerRef.current) clearInterval(micTimerRef.current);
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const applyCalibratedPhoto = (dataUrl: string) => {
    setIsCalibratingFace(true);
    setCalibrationProgress(0);

    const interval = setInterval(() => {
      setCalibrationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCalibratingFace(false);

          const updatedAvatar: AvatarProfile = {
            ...userAvatar,
            imageUrl: dataUrl,
            userUploadedPhotoUrl: dataUrl,
            trainingSamplesCount: userAvatar.trainingSamplesCount + 24,
            fidelityScore: 99.8,
          };

          onUpdateAvatar(updatedAvatar);
          setUploadNotification('Photo model calibrated! Your portrait is now active across all video generations.');
          setTimeout(() => setUploadNotification(null), 5000);
          return 100;
        }
        return prev + 20;
      });
    }, 180);
  };

  // 1. IMAGE UPLOAD HANDLER
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        applyCalibratedPhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // 1b. WEBCAM SNAPSHOT CAPTURE
  const handleToggleWebcam = async () => {
    if (isCameraActive) {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
        cameraStreamRef.current = null;
      }
      setIsCameraActive(false);
    } else {
      try {
        setIsCameraActive(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 720 }, height: { ideal: 720 } },
        });
        cameraStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        alert('Could not access webcam. You can upload an image file instead.');
        setIsCameraActive(false);
      }
    }
  };

  const handleCaptureWebcamSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 720, 720);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
        cameraStreamRef.current = null;
      }
      setIsCameraActive(false);
      applyCalibratedPhoto(dataUrl);
    }
  };

  // 2. MICROPHONE RECORDING (Real Web MediaRecorder)
  const handleToggleRecordMic = async () => {
    if (isRecordingMic) {
      // STOP RECORDING
      setIsRecordingMic(false);
      if (micTimerRef.current) clearInterval(micTimerRef.current);

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (err) {
          console.warn('Error stopping media recorder', err);
        }
      }
    } else {
      // START RECORDING
      setRecordingSeconds(0);
      audioChunksRef.current = [];

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
          };

          recorder.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            setAudioBlobUrl(url);

            onUpdateVoice({
              ...userVoice,
              recordedAudioDataUrl: url,
              sampleAudioDuration: `${recordingSeconds}s recorded sample`,
              recordingStatus: 'calibrated',
            });

            stream.getTracks().forEach((track) => track.stop());
          };

          recorder.start();
        }
      } catch (err) {
        console.warn('Microphone permission not granted or unavailable, using fallback timer', err);
      }

      setIsRecordingMic(true);
      micTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    }
  };

  // 3. CALIBRATE VOICE & INSTRUCTIONS
  const handleCalibrateVoiceModel = async () => {
    setIsCalibratingVoice(true);
    try {
      const response = await fetch('/api/ai/calibrate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationSeconds: recordingSeconds || 25,
          customInstructions,
        }),
      });

      const data = await response.json();
      setVoiceCalibrationDetails(data);

      onUpdateVoice({
        ...userVoice,
        customInstructions,
        sampleAudioDuration: `${recordingSeconds || 25}s calibrated sample`,
        recordingStatus: 'calibrated',
        toneDescription: customInstructions,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalibratingVoice(false);
    }
  };

  // 4. GENERATE & SPEAK ANY WORDS
  const handleSynthesizeAndSpeak = async () => {
    if (isTestingSpeech) {
      if (lipSyncRef.current) lipSyncRef.current.stop();
      setIsTestingSpeech(false);
      return;
    }

    setIsSynthesizingSpeech(true);

    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: testPhrase,
          voiceName: userVoice.geminiVoiceName || 'Puck',
          customInstructions,
        }),
      });

      const data = await res.json();
      setIsSynthesizingSpeech(false);
      setIsTestingSpeech(true);

      if (lipSyncRef.current) {
        lipSyncRef.current.speak(testPhrase, data.audioBase64 || null, () => {
          setIsTestingSpeech(false);
        });
      }
    } catch (err) {
      console.warn('Fallback to local speech synthesis', err);
      setIsSynthesizingSpeech(false);
      setIsTestingSpeech(true);
      if (lipSyncRef.current) {
        lipSyncRef.current.speak(testPhrase, null, () => {
          setIsTestingSpeech(false);
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Guided Step Notification */}
      <div className="bg-gradient-to-r from-purple-950/50 via-neutral-900/70 to-cyan-950/50 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
              {activeTab === 'avatar' ? 'Step 2: Digital Twin Photo' : 'Step 3: Voice Cloning & Instructions'}
            </span>
            <span className="text-xs text-neutral-400">
              {userAvatar.userUploadedPhotoUrl ? '✓ Photo Model Locked' : 'Upload Required'} •{' '}
              {userVoice.recordedAudioDataUrl ? '✓ Voice Sample Active' : 'Record Required'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {activeTab === 'avatar'
              ? 'Upload Your Picture to Model Your Realistic Avatar'
              : 'Record Voice Sample with Instructions for AI Reuse'}
          </h2>
          <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
            {activeTab === 'avatar'
              ? 'Upload your portrait or capture with your webcam. The neural engine models your face for realistic lip-syncing.'
              : 'Read the training prompt aloud, customize how you want the AI to speak, and test the voice sandbox with any words.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-950 p-1 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('avatar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'avatar'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>1. Upload Picture</span>
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'voice'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>2. Voice & Rules</span>
            </button>
          </div>
        </div>
      </div>

      {uploadNotification && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center justify-between text-emerald-300 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{uploadNotification}</span>
          </div>
          <button
            onClick={() => setActiveTab('voice')}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-neutral-950 rounded-lg font-bold text-xs hover:bg-emerald-400"
          >
            <span>Proceed to Voice Recording</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Avatar Stage & "Generate Any Words" Sandbox (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-neutral-900/70 p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Live Digital Twin Preview</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                {userAvatar.userUploadedPhotoUrl ? 'Your Photo Active' : 'Sample Portrait'}
              </span>
            </div>

            {/* Realistic Canvas Preview */}
            <div className="w-full aspect-[3/4] max-h-[380px] mx-auto rounded-2xl overflow-hidden shadow-2xl relative">
              <RealisticAvatarCanvas
                avatar={userAvatar}
                viseme={viseme}
                isSpeaking={isTestingSpeech}
                className="w-full h-full"
              />

              {/* Facial Mesh Calibration Overlay */}
              {isCalibratingFace && (
                <div className="absolute inset-0 bg-cyan-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
                  <Cpu className="w-10 h-10 text-cyan-400 animate-spin mb-3" />
                  <span className="font-bold text-white text-sm">
                    Calibrating Facial Mesh & Mouth Geometry...
                  </span>
                  <span className="text-xs font-mono text-cyan-300 mt-1">
                    {calibrationProgress}% Complete
                  </span>
                  <div className="w-48 h-1.5 bg-neutral-800 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${calibrationProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* "REUSE VOICE TO GENERATE ANY WORDS" SANDBOX */}
            <div className="p-4 bg-neutral-950/90 rounded-2xl border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Synthesize & Speak Any Words</span>
                </label>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Live Lip-Sync
                </span>
              </div>

              <textarea
                rows={2}
                value={testPhrase}
                onChange={(e) => setTestPhrase(e.target.value)}
                placeholder="Type any sentence here to have your cloned voice speak it..."
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-neutral-100 text-xs focus:outline-none focus:border-cyan-500 resize-none"
              />

              <button
                onClick={handleSynthesizeAndSpeak}
                disabled={isSynthesizingSpeech || !testPhrase}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isTestingSpeech
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-neutral-950 shadow-lg shadow-cyan-500/20'
                }`}
              >
                {isSynthesizingSpeech ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing in Your Voice...</span>
                  </>
                ) : isTestingSpeech ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Speech Playback</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Generate Speech & Animate Twin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Upload Photo / Record Voice with Instructions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: UPLOAD PICTURE AS MODEL */}
          {activeTab === 'avatar' && (
            <div className="bg-neutral-900/70 p-6 rounded-2xl border border-white/5 space-y-6">
              <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <FileImage className="w-5 h-5 text-purple-400" />
                    <span>Step 2: Upload Your Picture as Digital Twin Model</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Upload a portrait photo or snap a webcam picture. This visual model will be reused in every generated video.
                  </p>
                </div>

                <button
                  onClick={handleToggleWebcam}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 rounded-xl text-xs font-semibold shrink-0"
                >
                  <Camera className="w-4 h-4 text-purple-400" />
                  <span>{isCameraActive ? 'Close Camera' : 'Snap with Webcam'}</span>
                </button>
              </div>

              {/* Live Webcam Snap Stage */}
              {isCameraActive && (
                <div className="p-4 bg-neutral-950 rounded-2xl border border-purple-500/40 text-center space-y-3">
                  <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border-2 border-purple-400 bg-black">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />
                  </div>
                  <button
                    onClick={handleCaptureWebcamSnapshot}
                    className="px-5 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-500/20"
                  >
                    Capture This Snapshot
                  </button>
                </div>
              )}

              {/* Upload Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-purple-500/40 hover:border-purple-400 bg-purple-950/10 hover:bg-purple-950/20 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-white">Upload Your Portrait Photo File</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                  PNG, JPG, or WEBP. Front-facing with clean lighting produces best lip-sync results.
                </p>

                {userAvatar.userUploadedPhotoUrl ? (
                  <div className="mt-4 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Your Photo Model is Active</span>
                  </div>
                ) : (
                  <span className="mt-3 text-[11px] text-cyan-400 font-semibold underline">
                    Click to select file from your computer
                  </span>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Studio Lighting Presets */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Virtual Studio Lighting Preset for Your Photo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Cyber RGB Studio', desc: 'Dual cyan & purple rim lights' },
                    { id: 'Softbox Warm Studio', desc: 'Natural warm creator studio lighting' },
                    { id: 'Moody Dark Executive', desc: 'Deep blacks with cinematic rim light' },
                    { id: 'High-Key White', desc: 'Ultra clean commercial tech lighting' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() =>
                        onUpdateAvatar({
                          ...userAvatar,
                          lightingPreset: preset.id as any,
                        })
                      }
                      className={`p-3 rounded-xl border text-left transition-all ${
                        userAvatar.lightingPreset === preset.id
                          ? 'bg-neutral-800 border-purple-400 ring-1 ring-purple-400/50'
                          : 'bg-neutral-950/60 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="font-bold text-white text-xs block">{preset.id}</span>
                      <span className="text-[11px] text-neutral-400 mt-0.5 block">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Step Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('voice')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
                >
                  <span>Confirm Photo & Continue to Voice Recording</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: RECORD VOICE WITH INSTRUCTIONS */}
          {activeTab === 'voice' && (
            <div className="bg-neutral-900/70 p-6 rounded-2xl border border-white/5 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Mic className="w-5 h-5 text-emerald-400" />
                  <span>Step 3: Record Your Voice & Provide AI Instructions</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Read our short-form training prompts aloud so the AI learns your vocal cadence, resonance,
                  and emphasis patterns. Then configure custom delivery instructions so the AI speaks in your
                  exact style.
                </p>
              </div>

              {/* Guided Script Carousel */}
              <div className="p-4 bg-neutral-950/90 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {GUIDED_RECORDING_SCRIPTS[activeScriptIndex].title}
                  </span>
                  <div className="flex gap-1.5">
                    {GUIDED_RECORDING_SCRIPTS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveScriptIndex(i)}
                        className={`w-6 h-6 rounded-lg text-xs font-mono font-bold transition-colors ${
                          activeScriptIndex === i
                            ? 'bg-amber-400 text-neutral-950'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-neutral-900 rounded-xl border border-white/5">
                  <p className="text-sm font-medium text-white italic leading-relaxed">
                    "{GUIDED_RECORDING_SCRIPTS[activeScriptIndex].text}"
                  </p>
                  <span className="text-[10px] text-amber-400/90 block mt-2 font-mono">
                    💡 Delivery Tip: {GUIDED_RECORDING_SCRIPTS[activeScriptIndex].pacingHint}
                  </span>
                </div>
              </div>

              {/* Microphone Recording Station */}
              <div className="p-5 bg-neutral-950 rounded-2xl border border-white/5 text-center space-y-3">
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleToggleRecordMic}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-xl ${
                      isRecordingMic
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                    }`}
                  >
                    {isRecordingMic ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>

                  <span className="font-bold text-white text-sm mt-3">
                    {isRecordingMic
                      ? `Recording Voice Sample: ${recordingSeconds}s`
                      : audioBlobUrl
                      ? 'Voice Sample Recorded & Ready'
                      : 'Click Mic & Read Training Prompt Aloud'}
                  </span>
                  <p className="text-xs text-neutral-400 max-w-sm mt-0.5">
                    {isRecordingMic
                      ? 'Speak naturally into your mic using the training script above...'
                      : 'Record 15–30 seconds of speech for authentic vocal reproduction.'}
                  </p>
                </div>

                {/* Animated Spectrum Waveform while recording */}
                {isRecordingMic && (
                  <div className="flex items-center justify-center gap-1 h-7 pt-2">
                    {[14, 26, 18, 38, 22, 42, 28, 16, 32, 12, 36, 20].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-rose-400 rounded-full animate-bounce"
                        style={{
                          height: `${h}px`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Audio playback of recorded voice */}
                {audioBlobUrl && !isRecordingMic && (
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <audio src={audioBlobUrl} controls className="h-8 max-w-xs" />
                  </div>
                )}
              </div>

              {/* CUSTOM INSTRUCTIONS FOR AI VOICE DELIVERY */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Custom Delivery Instructions for the AI
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Prompt Guidance
                  </span>
                </div>

                {/* Preset Pills */}
                <div className="flex flex-wrap gap-2">
                  {VOICE_INSTRUCTION_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCustomInstructions(preset.instruction)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                        customInstructions === preset.instruction
                          ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                          : 'bg-neutral-950 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Speak with high-retention cadence, emphasize punch words, zero hesitation, crisp confident broadcast tone..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-emerald-500 resize-none font-mono text-[11px]"
                />

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleCalibrateVoiceModel}
                    disabled={isCalibratingVoice}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl text-xs transition-colors border border-white/10"
                  >
                    <Cpu className={`w-3.5 h-3.5 ${isCalibratingVoice ? 'animate-spin' : ''}`} />
                    <span>{isCalibratingVoice ? 'Calibrating...' : 'Save Voice Model & Instructions'}</span>
                  </button>

                  {onProceedToNextStep && (
                    <button
                      onClick={onProceedToNextStep}
                      className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
                    >
                      <span>Next: Topic & Script Generation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
