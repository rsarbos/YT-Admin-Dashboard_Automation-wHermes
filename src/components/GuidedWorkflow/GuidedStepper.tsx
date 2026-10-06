import React from 'react';
import { GuidedStep, NavigationTab } from '../../types';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  Mic,
  Film,
  Sparkles,
  Youtube,
  Download,
  Sliders,
} from 'lucide-react';

interface GuidedStepperProps {
  currentStep: GuidedStep;
  isGuidedMode: boolean;
  hasUploadedPhoto: boolean;
  hasRecordedVoice: boolean;
  hasChannelSet: boolean;
  onSelectStep: (step: GuidedStep) => void;
  onToggleGuidedMode: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const STEPS_CONFIG = [
  {
    step: 1 as GuidedStep,
    tab: 'channels' as NavigationTab,
    title: '1. Channel & Niche',
    shortDesc: 'Set your channel name & niche',
    icon: Youtube,
  },
  {
    step: 2 as GuidedStep,
    tab: 'avatar' as NavigationTab,
    title: '2. Upload Your Picture',
    shortDesc: 'Create your 100% realistic avatar',
    icon: UserCheck,
  },
  {
    step: 3 as GuidedStep,
    tab: 'avatar' as NavigationTab,
    title: '3. Record Voice & Rules',
    shortDesc: 'Record voice with instructions',
    icon: Mic,
  },
  {
    step: 4 as GuidedStep,
    tab: 'keywords' as NavigationTab,
    title: '4. Topic & AI Script',
    shortDesc: 'Pick trend & generate retention hook',
    icon: Sparkles,
  },
  {
    step: 5 as GuidedStep,
    tab: 'editor' as NavigationTab,
    title: '5. Editor & Real Export',
    shortDesc: 'Drag & drop edit, export video',
    icon: Film,
  },
];

export const GuidedStepper: React.FC<GuidedStepperProps> = ({
  currentStep,
  isGuidedMode,
  hasUploadedPhoto,
  hasRecordedVoice,
  hasChannelSet,
  onSelectStep,
  onToggleGuidedMode,
  onNextStep,
  onPrevStep,
}) => {
  const getStepStatus = (step: GuidedStep) => {
    if (step === 1 && hasChannelSet) return 'completed';
    if (step === 2 && hasUploadedPhoto) return 'completed';
    if (step === 3 && hasRecordedVoice) return 'completed';
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-[#0b0c16] border-b border-white/10 px-5 py-3 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Step Breadcrumbs & Wizard title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
              Guided Creator Pipeline
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Stepper Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {STEPS_CONFIG.map((item, idx) => {
              const status = getStepStatus(item.step);
              const isActive = currentStep === item.step;
              const IconComp = item.icon;

              return (
                <React.Fragment key={item.step}>
                  <button
                    onClick={() => onSelectStep(item.step)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                      isActive
                        ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400'
                        : status === 'completed'
                        ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                        : 'bg-neutral-900/80 border border-white/5 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {status === 'completed' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <IconComp className="w-3.5 h-3.5" />
                    )}
                    <span>{item.title}</span>
                  </button>

                  {idx < STEPS_CONFIG.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right: Next / Prev guidance buttons */}
        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <button
              onClick={onPrevStep}
              className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold border border-white/10 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {currentStep < 5 ? (
            <button
              onClick={onNextStep}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <span>Next: {STEPS_CONFIG[currentStep].title.split('. ')[1]}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onNextStep}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-neutral-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Finished Video</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
