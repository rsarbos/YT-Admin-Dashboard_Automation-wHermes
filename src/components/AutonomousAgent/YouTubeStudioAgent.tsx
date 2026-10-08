import React, { useState, useEffect } from 'react';
import {
  Channel,
  VideoProject,
  TimelineScene,
  AutonomousCycleReport,
  CompetitorAuditDetail,
  CompetitorVideoPattern,
} from '../../types';
import {
  Sparkles,
  Bot,
  Play,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Search,
  Eye,
  Award,
  Share2,
  Film,
  Zap,
  Target,
  FileText,
  Copy,
  Download,
  Calendar,
  Radio,
  ExternalLink,
  ChevronRight,
  Flame,
  Volume2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface YouTubeStudioAgentProps {
  channels: Channel[];
  activeChannel: Channel;
  onSelectChannel: (channelId: string) => void;
  onLoadProjectToEditor: (project: VideoProject) => void;
  onOpenThumbnailStudio?: () => void;
  onOpenCompetitors?: () => void;
}

export const YouTubeStudioAgent: React.FC<YouTubeStudioAgentProps> = ({
  channels,
  activeChannel,
  onSelectChannel,
  onLoadProjectToEditor,
  onOpenThumbnailStudio,
  onOpenCompetitors,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStageTab, setActiveStageTab] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [autoPilotEnabled, setAutoPilotEnabled] = useState<boolean>(false);
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [copiedLog, setCopiedLog] = useState<boolean>(false);
  const [copiedTags, setCopiedTags] = useState<boolean>(false);
  const [currentCycle, setCurrentCycle] = useState<AutonomousCycleReport | null>(null);

  // Auto-run initial cycle or preload for active channel if not already generated
  useEffect(() => {
    if (!currentCycle || currentCycle.channelId !== activeChannel.id) {
      handleRunCycle(false);
    }
  }, [activeChannel.id]);

  const handleRunCycle = async (showRunningState = true) => {
    if (showRunningState) setIsRunning(true);

    try {
      const res = await fetch('/api/agent/run-autonomous-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: activeChannel.id,
          channelName: activeChannel.name,
          channelNiche: activeChannel.niche,
          channelHandle: activeChannel.handle,
          targetTopic: customTopicInput.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data: AutonomousCycleReport = await res.json();
        setCurrentCycle(data);
      }
    } catch (err) {
      console.error('Error running autonomous pipeline:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleLoadIntoEditor = () => {
    if (!currentCycle) return;
    const { stage2ContentScript, stage3ThumbnailEngineering, stage4ViralMetadata } = currentCycle;

    const newProject: VideoProject = {
      id: 'proj-' + Math.random().toString(36).substring(2, 9),
      title: stage2ContentScript.title,
      channelId: activeChannel.id,
      aspectRatio: '9:16',
      durationSeconds: stage2ContentScript.estimatedDuration || 52,
      hook: stage2ContentScript.viralHook3s,
      captionStyle: {
        id: 'cap-hormozi',
        name: 'Hormozi Viral Yellow',
        fontFamily: 'Cabinet Grotesk',
        color: '#ffffff',
        highlightColor: '#facc15',
        uppercase: true,
        animation: 'hormozi-punch',
        fontSize: 30,
      },
      tags: stage4ViralMetadata.tags.map((t) => (t.startsWith('#') ? t : `#${t}`)),
      searchVolumeRank: stage4ViralMetadata.algorithmSearchScore,
      avatarOverlay: {
        enabled: true,
        avatarId: activeChannel.defaultAvatarId || 'avatar-user-twin',
        position: 'bottom-right',
        scale: 0.85,
        showCutout: true,
        lipSyncSyncRate: 99.8,
      },
      voiceConfig: {
        voiceId: activeChannel.defaultVoiceId || 'voice-user-clone',
        isCustomClone: true,
        pitch: 1.0,
        cadence: 1.15,
      },
      thumbnail: {
        textOverlay: stage3ThumbnailEngineering.overlayHeadline,
        avatarReaction: 'Expresión de impacto y alto contraste',
        primaryBgUrl: stage3ThumbnailEngineering.previewImageUrl,
        accentColor: stage3ThumbnailEngineering.colorScheme[0] || '#facc15',
      },
      status: currentCycle.stage5PublishSchedule.publicationStatus === 'PUBLICADO_DE_INMEDIATO' ? 'published' : 'scheduled',
      scenes: stage2ContentScript.scenes,
    };

    onLoadProjectToEditor(newProject);
  };

  const copyLogToClipboard = () => {
    if (!currentCycle) return;
    navigator.clipboard.writeText(currentCycle.executiveSummaryLog);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2500);
  };

  const copyTagsToClipboard = () => {
    if (!currentCycle) return;
    navigator.clipboard.writeText(currentCycle.stage4ViralMetadata.tags.join(', '));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2500);
  };

  const isEmprendenmx = activeChannel.name.toLowerCase().includes('emprende') || activeChannel.handle.toLowerCase().includes('emprende');

  return (
    <div className="flex-1 overflow-y-auto bg-[#07080d] p-6 text-neutral-100 space-y-6">
      {/* Top Banner: Autonomous Multi-Channel Operations */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-neutral-900/90 to-purple-950/40 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                YOUTUBE STUDIO AI AGENT &bull; AUTONOMOUS OPERATOR
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                Pipeline Activo
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Agente Autónomo de YouTube</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-normal">
                Multi-Canal &bull; 5 Etapas
              </span>
            </h1>
            <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
              Opera, investiga y escala canales de YouTube de forma autónoma. Ejecuta todo el ciclo:
              desde <span className="text-amber-300 font-semibold">Research de Nicho & Auditoría Top 3</span> hasta{' '}
              <span className="text-amber-300 font-semibold">Guion Viral</span>,{' '}
              <span className="text-amber-300 font-semibold">Miniatura CTR Premium</span>,{' '}
              <span className="text-amber-300 font-semibold">Metadata Algorítmica</span> y{' '}
              <span className="text-amber-300 font-semibold">Publicación en Horario Óptimo</span>.
            </p>
          </div>

          {/* Right Action Cluster */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Auto-Pilot Toggle */}
            <button
              onClick={() => setAutoPilotEnabled(!autoPilotEnabled)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-semibold border flex items-center justify-center gap-2 transition-all ${
                autoPilotEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                  : 'bg-neutral-900/80 text-neutral-400 border-white/10 hover:border-white/20'
              }`}
            >
              <Bot className={`w-4 h-4 ${autoPilotEnabled ? 'text-emerald-400 animate-spin' : ''}`} />
              <span>Piloto Automático: {autoPilotEnabled ? 'ON (Cada 4h)' : 'MANUAL'}</span>
            </button>

            {/* Execute Button */}
            <button
              onClick={() => handleRunCycle(true)}
              disabled={isRunning}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-neutral-950" />
                  <span>Ejecutando Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-neutral-950 fill-neutral-950" />
                  <span>EJECUTAR CICLO AUTÓNOMO</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Channel Selector Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider mr-2">
              Canal Activo:
            </span>
            {channels.map((chan) => {
              const isActive = chan.id === activeChannel.id;
              const isEmprende = chan.name.toLowerCase().includes('emprende');
              return (
                <button
                  key={chan.id}
                  onClick={() => onSelectChannel(chan.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/30'
                      : 'bg-neutral-900/80 text-neutral-300 border border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <img
                    src={chan.avatarUrl}
                    alt={chan.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/20"
                  />
                  <span>{chan.name}</span>
                  {isEmprende && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-neutral-950/30 text-neutral-950' : 'bg-amber-500/20 text-amber-300'}`}>
                      FLAGSHIP
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="text-neutral-500">Nicho:</span>
            <span className="text-neutral-200 font-medium truncate max-w-[280px]">
              {activeChannel.niche}
            </span>
          </div>
        </div>
      </div>

      {/* Optional Target Topic Customizer */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-neutral-900/60 border border-white/5 p-3 rounded-2xl">
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono shrink-0 px-2">
          <Target className="w-4 h-4 text-amber-400" />
          <span>Tema Específico (Opcional):</span>
        </div>
        <input
          type="text"
          value={customTopicInput}
          onChange={(e) => setCustomTopicInput(e.target.value)}
          placeholder={
            isEmprendenmx
              ? 'Ej: "3 Negocios con menos de $2,000 pesos en México" o deja vacío para detección autónoma'
              : 'Ej: "Cómo automatizar la creación de contenido con IA" o deja vacío para detección autónoma'
          }
          className="flex-1 w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
        />
        <button
          onClick={() => handleRunCycle(true)}
          className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 shrink-0 border border-white/10 transition-colors"
        >
          Aplicar y Correr
        </button>
      </div>

      {/* 5-Stage Pipeline Stepper Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {[
          { step: 1, title: '1. Research & Top 3', sub: 'Nicho y Auditoría', icon: Search, color: 'text-amber-400' },
          { step: 2, title: '2. Guion & Escenas', sub: 'Hook 0-3s & Pacing', icon: Film, color: 'text-cyan-400' },
          { step: 3, title: '3. Miniatura CTR', sub: 'Ingeniería Visual', icon: Award, color: 'text-rose-400' },
          { step: 4, title: '4. Metadata SEO', sub: 'Algoritmo & Tags', icon: TrendingUp, color: 'text-emerald-400' },
          { step: 5, title: '5. Publicación', sub: 'Horarios Óptimos', icon: Calendar, color: 'text-purple-400' },
        ].map((tab) => {
          const isActive = activeStageTab === tab.step;
          const Icon = tab.icon;
          return (
            <button
              key={tab.step}
              onClick={() => setActiveStageTab(tab.step as any)}
              className={`p-3 rounded-2xl text-left border transition-all ${
                isActive
                  ? 'bg-neutral-800/95 border-amber-500/50 shadow-lg shadow-black/60'
                  : 'bg-neutral-900/40 border-white/5 hover:border-white/15 hover:bg-neutral-900/80 text-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  LISTO
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold text-white leading-tight">{tab.title}</div>
                <div className="text-[11px] text-neutral-400">{tab.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Area based on Selected Stage */}
      {currentCycle && (
        <div className="space-y-6">
          {/* STAGE 1: NICHE RESEARCH & COMPETITOR AUDIT */}
          {activeStageTab === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Niche Summary Card */}
              <div className="bg-neutral-900/80 border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Detección y Research de Nicho</h2>
                      <p className="text-xs text-neutral-400">
                        Análisis automatizado de metadatos, tags y audiencia objetivo para {activeChannel.name}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-neutral-800 text-amber-400 px-3 py-1 rounded-full border border-white/10">
                    Duración Óptima Detectada: {currentCycle.stage1NicheResearch.optimalDurationSeconds}s
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-neutral-950/70 border border-white/5 space-y-1.5">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase">Nicho Identificado</span>
                    <div className="text-sm font-semibold text-neutral-100">
                      {currentCycle.stage1NicheResearch.detectedNiche}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950/70 border border-white/5 space-y-1.5">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase">Audiencia Objetivo</span>
                    <div className="text-sm font-semibold text-neutral-100">
                      {currentCycle.stage1NicheResearch.targetAudience}
                    </div>
                  </div>
                </div>

                {/* Core Pillars */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-neutral-400 uppercase">Pilares de Contenido Estratégicos:</span>
                  <div className="flex flex-wrap gap-2">
                    {currentCycle.stage1NicheResearch.corePillars.map((pillar, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-medium"
                      >
                        &bull; {pillar}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hook Pattern Summary Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-neutral-900 border border-amber-500/30 flex items-start gap-3">
                  <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                      Patrón de Engagement Dominante en el Nicho:
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {currentCycle.stage1NicheResearch.winningHookSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Top 3 Competitors Audit */}
              <div className="bg-neutral-900/80 border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-rose-400" />
                    <h3 className="text-base font-bold text-white">Auditoría de Competencia (Top 3 Canales)</h3>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    Líderes de nicho con mayor tracción y vistas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentCycle.stage1NicheResearch.top3Competitors.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-neutral-950 border border-white/5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            #{idx + 1} EN EL NICHO
                          </span>
                          <span className="text-xs font-mono text-neutral-400">{comp.subscribers}</span>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">{comp.name}</h4>
                          <span className="text-xs font-mono text-neutral-400">{comp.handle}</span>
                        </div>
                        <div className="text-xs text-emerald-400 font-mono">
                          Promedio: {comp.avgViews}
                        </div>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-500 uppercase block">Diferenciador Clave</span>
                          <p className="text-neutral-300 mt-0.5">{comp.keyDifferentiator}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
                          <span className="text-[10px] font-mono text-rose-400 uppercase block font-bold">
                            Punto Débil en Miniaturas:
                          </span>
                          <p className="text-neutral-300 mt-0.5 text-[11px] leading-relaxed">
                            {comp.thumbnailWeakness}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis of Top 10 Most Viewed Videos */}
              <div className="bg-neutral-900/80 border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">
                      Análisis de Éxito: Top 10 Videos Más Vistos de la Competencia
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">
                    Patrones de Retención & Hooks Virales
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-neutral-400 font-mono text-[11px]">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Título Viral</th>
                        <th className="py-2.5 px-3">Vistas</th>
                        <th className="py-2.5 px-3">Tipo de Hook</th>
                        <th className="py-2.5 px-3">Formato & Duración</th>
                        <th className="py-2.5 px-3">Disparador de Retención</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {currentCycle.stage1NicheResearch.top10VideosPatterns.map((vid, idx) => (
                        <tr key={idx} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-neutral-500">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-white max-w-xs truncate">{vid.title}</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{vid.views}</td>
                          <td className="py-2.5 px-3 text-amber-300 font-medium">{vid.hookType}</td>
                          <td className="py-2.5 px-3 font-mono text-neutral-400">{vid.durationSeconds}s ({vid.format})</td>
                          <td className="py-2.5 px-3 text-neutral-300">{vid.retentionTrigger}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: VIRAL SCRIPT & VIDEO PRODUCTION */}
          {activeStageTab === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Script Header Card */}
              <div className="bg-neutral-900/80 border border-white/5 rounded-3xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Generación de Contenido (Guion + Visual)</h2>
                      <p className="text-xs text-neutral-400">
                        Estructurado con hook viral en los primeros 3 segundos, retención optimizada y CTA
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLoadIntoEditor}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs flex items-center gap-2 hover:bg-cyan-400 transition-colors"
                  >
                    <Film className="w-4 h-4" />
                    <span>Cargar en Editor de Video</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-mono text-neutral-400 uppercase">Título de Producción:</div>
                  <h3 className="text-xl font-extrabold text-white">{currentCycle.stage2ContentScript.title}</h3>
                </div>

                {/* 3-Second Viral Hook Highlight */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-amber-950/30 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      Hook Viral (Primeros 0-3 Segundos &bull; Thumb-Stopping):
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      &gt;88% RETENCIÓN PROYECTADA
                    </span>
                  </div>
                  <p className="text-base font-bold text-white leading-relaxed">
                    "{currentCycle.stage2ContentScript.viralHook3s}"
                  </p>
                </div>

                {/* Retention Strategy & CTA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase">Estrategia de Retención</span>
                    <p className="text-xs text-neutral-200 leading-relaxed">
                      {currentCycle.stage2ContentScript.retentionStrategy}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-white/5 space-y-1">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase">Llamado a la Acción (CTA & Loop)</span>
                    <p className="text-xs text-neutral-200 leading-relaxed">
                      {currentCycle.stage2ContentScript.callToAction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scene-by-Scene Production Breakdown */}
              <div className="bg-neutral-900/80 border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <span>Despiece Técnico de Escenas ({currentCycle.stage2ContentScript.scenes.length} Escenas Listas para Render)</span>
                  </h3>
                  <span className="text-xs font-mono text-neutral-400">
                    Duración Total: {currentCycle.stage2ContentScript.estimatedDuration}s
                  </span>
                </div>

                <div className="space-y-3">
                  {currentCycle.stage2ContentScript.scenes.map((scene, idx) => (
                    <div
                      key={scene.id || idx}
                      className="p-4 rounded-2xl bg-neutral-950 border border-white/5 hover:border-white/15 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            ESCENA {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white">{scene.title}</span>
                        </div>
                        <span className="text-xs font-mono text-neutral-400">
                          {scene.start}s - {(scene.start + scene.duration).toFixed(1)}s ({scene.duration}s)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 space-y-1">
                          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Voz en Off (Locución)</span>
                          <p className="text-neutral-100">{scene.narration}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 space-y-1">
                          <span className="text-[10px] font-mono text-cyan-400 uppercase block">Subtítulo Cinético en Pantalla</span>
                          <p className="text-white font-bold">{scene.caption}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 space-y-1">
                          <span className="text-[10px] font-mono text-amber-400 uppercase block">Prompt B-Roll Visual ({scene.visualModel || 'Imagen 3'})</span>
                          <p className="text-neutral-300 italic">{scene.bRollPrompt}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1">
                        <span>SFX: <strong className="text-neutral-300">{scene.sfx}</strong></span>
                        <span>Emoción Avatar: <strong className="text-amber-300">{scene.avatarEmotion}</strong></span>
                        <span>Cámara: <strong className="text-neutral-300">{scene.cameraZoom}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: THUMBNAIL ENGINEERING (CTR SUPERIOR) */}
          {activeStageTab === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-neutral-900/80 border border-white/5 rounded-3xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Ingeniería de Thumbnails (Miniaturas Premium)</h2>
                      <p className="text-xs text-neutral-400">
                        Scraping de puntos débiles de la competencia y diseño paralelo que maximiza CTR
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-rose-500/10 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full font-bold">
                    {currentCycle.stage3ThumbnailEngineering.predictedCtrGain}
                  </span>
                </div>

                {/* Weaknesses Detected */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-neutral-400 uppercase">
                    Puntos Débiles Detectados en los Top 3 Competidores:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentCycle.stage3ThumbnailEngineering.competitorWeaknessesDetected.map((weak, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-2.5 text-xs text-neutral-200"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{weak}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thumbnail Preview & Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Left: Visual Render Card */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-neutral-400 uppercase">
                      Miniatura Diseñada para Superar a la Competencia:
                    </span>
                    <div className="relative aspect-[9/16] sm:aspect-video rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl group">
                      <img
                        src={currentCycle.stage3ThumbnailEngineering.previewImageUrl}
                        alt="Thumbnail Premium"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-red-600 text-white font-mono font-black text-xs shadow-lg">
                          ALTO CTR
                        </span>
                        <span className="px-2 py-1 rounded bg-black/80 backdrop-blur-md text-amber-300 font-mono text-[10px] border border-amber-500/40">
                          CONSTRAST: {currentCycle.stage3ThumbnailEngineering.contrastRatio}
                        </span>
                      </div>

                      {/* Headline Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 space-y-2">
                        <div className="bg-yellow-400 text-neutral-950 font-black text-lg sm:text-2xl px-3 py-1.5 rounded-xl uppercase tracking-tighter shadow-2xl inline-block border-2 border-neutral-950">
                          {currentCycle.stage3ThumbnailEngineering.overlayHeadline}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-white/90 bg-neutral-900/90 px-2 py-0.5 rounded backdrop-blur">
                            {activeChannel.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Engineering Specifications */}
                  <div className="p-5 rounded-2xl bg-neutral-950 border border-white/5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-amber-400 uppercase font-bold">
                        Especificación Técnica de Ingeniería CTR:
                      </span>
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-neutral-400 uppercase">Headline Móvil de Alto Impacto:</span>
                        <div className="text-sm font-bold text-white bg-neutral-900 p-2.5 rounded-xl border border-white/5">
                          {currentCycle.stage3ThumbnailEngineering.overlayHeadline}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-neutral-400 uppercase">Paleta de Colores de Alta Saturación:</span>
                        <div className="flex items-center gap-2">
                          {currentCycle.stage3ThumbnailEngineering.colorScheme.map((color, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-[11px] font-mono text-neutral-300">
                              <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                              <span>{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-neutral-400 uppercase">Prompt de Generación Imagen 3 / Flux:</span>
                        <p className="text-xs text-neutral-300 bg-neutral-900 p-3 rounded-xl border border-white/5 italic leading-relaxed">
                          "{currentCycle.stage3ThumbnailEngineering.ctrSuperpowerPrompt}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex gap-2">
                      <button
                        onClick={onOpenThumbnailStudio}
                        className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white border border-white/10 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Abrir en Thumbnail Studio</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: VIRAL METADATA & SEO */}
          {activeStageTab === 4 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-neutral-900/80 border border-white/5 rounded-3xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Metadata Cualificada y Viral</h2>
                      <p className="text-xs text-neutral-400">
                        Copywriting y SEO optimizados para los algoritmos de búsqueda y sugeridos de YouTube
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-400">Score Algorítmico:</span>
                    <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                      {currentCycle.stage4ViralMetadata.algorithmSearchScore}/100
                    </span>
                  </div>
                </div>

                {/* High Impact Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-400 uppercase">Título de Alto Impacto SEO:</span>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {currentCycle.stage4ViralMetadata.seoTitle.length} / 100 caracteres
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 text-base font-bold text-white flex items-center justify-between gap-3">
                    <span>{currentCycle.stage4ViralMetadata.seoTitle}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(currentCycle.stage4ViralMetadata.seoTitle)}
                      className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                      title="Copiar Título"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Algorithmic Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-400 uppercase">
                      Descripción con Timestamps y Palabras Clave:
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(currentCycle.stage4ViralMetadata.seoDescription)}
                      className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Descripción</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-neutral-950 border border-white/5 text-xs text-neutral-300 font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                    {currentCycle.stage4ViralMetadata.seoDescription}
                  </pre>
                </div>

                {/* Keywords, Hashtags & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase">Hashtags Oficiales:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCycle.stage4ViralMetadata.hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-neutral-400 uppercase">Tags de YouTube Studio:</span>
                      <button
                        onClick={copyTagsToClipboard}
                        className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedTags ? '¡Copiados!' : 'Copiar Tags'}</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCycle.stage4ViralMetadata.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-white/5 text-[11px] font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 5: PUBLISH & SMART SCHEDULING SYSTEM */}
          {activeStageTab === 5 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-neutral-900/80 border border-white/5 rounded-3xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Sistema de Publicación y Programación Inteligente</h2>
                      <p className="text-xs text-neutral-400">
                        Evaluación algorítmica de momentos de mayor influencia y tráfico orgánico
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs font-mono text-neutral-300">
                      {currentCycle.stage5PublishSchedule.currentTimeFormatted}
                    </span>
                  </div>
                </div>

                {/* Decision Status Banner */}
                <div
                  className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    currentCycle.stage5PublishSchedule.publicationStatus === 'PUBLICADO_DE_INMEDIATO'
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : 'bg-amber-950/30 border-amber-500/40'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase tracking-wider font-bold text-neutral-400">
                      Decisión Algorítmica de Publicación:
                    </span>
                    <div className="text-xl font-extrabold flex items-center gap-3">
                      {currentCycle.stage5PublishSchedule.publicationStatus === 'PUBLICADO_DE_INMEDIATO' ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          <span className="text-emerald-400">¡PUBLICADO DE INMEDIATO EN YOUTUBE!</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-6 h-6 text-amber-400" />
                          <span className="text-amber-400">PROGRAMADO PARA HORARIO PICO (BORRADOR LISTO)</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 max-w-xl mt-1">
                      {currentCycle.stage5PublishSchedule.actionLog}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/10 text-right shrink-0">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">Hora Programada</span>
                    <span className="text-base font-bold text-white font-mono">
                      {currentCycle.stage5PublishSchedule.scheduledTimeFormatted}
                    </span>
                  </div>
                </div>

                {/* Traffic Curve Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
                    <span className="text-xs font-mono text-neutral-400 uppercase">Ventana Óptima del Nicho:</span>
                    <div className="text-base font-bold text-amber-300">
                      {currentCycle.stage5PublishSchedule.peakOrganicWindow}
                    </div>
                    <p className="text-xs text-neutral-400">
                      Horario de máximo consumo de contenidos de negocios, finanzas y emprendimiento en México y Latam.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
                    <span className="text-xs font-mono text-neutral-400 uppercase">Lógica de Coincidencia:</span>
                    <div className="text-sm font-mono text-neutral-200">
                      {currentCycle.stage5PublishSchedule.coincidesWithPeak ? (
                        <span className="text-emerald-400 font-bold">
                          &bull; Coincide con la ventana pico: El video se lanza en vivo sin esperas.
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold">
                          &bull; Fuera de ventana pico: El video queda guardado y listo para publicarse en la hora programada.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXECUTIVE CYCLE REPORT & TERMINAL LOG (Execution Rule Demanded) */}
          <div className="bg-neutral-950 rounded-3xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Log de Auditoría & Reporte de Ciclo Autónomo
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyLogToClipboard}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLog ? '¡Copiado!' : 'Copiar Log'}</span>
                </button>
                <button
                  onClick={handleLoadIntoEditor}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Cargar en Editor</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-[#030407] border border-white/5 text-[11px] font-mono text-emerald-400/90 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto selection:bg-amber-500 selection:text-neutral-950">
              {currentCycle.executiveSummaryLog}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
